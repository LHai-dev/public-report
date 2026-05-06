import {
  HttpBadRequest,
  HttpInternalServerError,
  isHttpException,
} from "@httpx/exception";
import type { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";
import { Result } from "better-result";
import { z } from "zod/v4";

const verifyEndpoint =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const responseHeaders = {
  "content-type": "application/json",
};

export const TurnstileSchema = z.object({
  token: z.string(),
});

export async function POST(request: Request) {
  try {
    const parsed = await Result.tryPromise(() => request.json());

    if (parsed.isErr()) {
      throw new HttpBadRequest(parsed.error.message);
    }

    const validatedInput = TurnstileSchema.safeParse(parsed.value);

    if (!validatedInput.success) {
      throw new HttpBadRequest(z.prettifyError(validatedInput.error));
    }

    const { token } = validatedInput.data;

    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
      throw new HttpBadRequest("invalid secret");
    }

    const data = (await fetch(verifyEndpoint, {
      method: "POST",
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    }).then((res) => res.json())) as TurnstileServerValidationResponse;

    if (!data.success) {
      return new Response(JSON.stringify(data), {
        status: 400,
        headers: responseHeaders,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    if (isHttpException(error)) {
      return Response.json(
        { message: error.message, status: false, data: null },
        { status: error.statusCode },
      );
    }

    const serverError = new HttpInternalServerError({
      message: "An unexpected error occurred",
      cause: error instanceof Error ? error : undefined,
    });

    return Response.json(
      { message: serverError.message, status: false },
      { status: serverError.statusCode },
    );
  }
}
