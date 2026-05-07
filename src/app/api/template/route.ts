import { templateService } from "@/server/template";
import {
  HttpBadRequest,
  HttpInternalServerError,
  HttpTooManyRequests,
  isHttpException,
} from "@httpx/exception";
import z from "zod/v4";
import { Result } from "better-result";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limiting";
import { validateTurnstile } from "@/lib/validate-turnstile";
import { TemplateWithTurnstileSchema } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const getIp =
      headersList.get("cf-connecting-ip") ||
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";

    const rl = rateLimit(getIp);

    if (!rl) {
      throw new HttpTooManyRequests();
    }

    const parsed = await Result.tryPromise(() => req.json());

    if (parsed.isErr()) {
      throw new HttpBadRequest(parsed.error.message);
    }

    const validatedInput = TemplateWithTurnstileSchema.safeParse(parsed.value);

    if (!validatedInput.success) {
      throw new HttpBadRequest(z.prettifyError(validatedInput.error));
    }

    const { commune, name, birth, percentage, phoneNumber, turnstileToken } =
      validatedInput.data;

    if (!turnstileToken) {
      throw new HttpBadRequest("Missing captcha token");
    }

    const turnstileResponse = await validateTurnstile(turnstileToken, getIp);

    const result = await templateService.create({
      commune,
      name,
      birth,
      percentage,
      phoneNumber,
    });

    return Response.json({
      success: true,
      message: "submitted",
      data: {
        result,
        turnstileResponse,
      },
    });
  } catch (error) {
    console.log("error", error);

    if (isHttpException(error)) {
      return Response.json(
        {
          success: false,
          error: { code: String(error.statusCode), message: error.message },
        },
        { status: error.statusCode },
      );
    }

    const serverError = new HttpInternalServerError({
      message: "An unexpected error occurred",
      cause: error instanceof Error ? error : undefined,
    });

    return Response.json(
      {
        success: false,
        error: { code: "INTERNAL_SERVER_ERROR", message: serverError.message },
      },
      { status: serverError.statusCode },
    );
  }
}

export async function GET() {
  try {
    const headersList = await headers();
    const getIp =
      headersList.get("cf-connecting-ip") ||
      headersList.get("x-forwarded-for")?.split(",")[0];

    const rl = rateLimit(getIp!);

    console.log("rl", rl);

    if (!rl) {
      throw new HttpTooManyRequests();
    }

    const result = await templateService.getAll();
    return Response.json({ success: true, message: "", data: result });
  } catch (error) {
    if (isHttpException(error)) {
      return Response.json(
        {
          success: false,
          error: { code: String(error.statusCode), message: error.message },
        },
        { status: error.statusCode },
      );
    }

    const serverError = new HttpInternalServerError({
      message: "An unexpected error occurred",
      cause: error instanceof Error ? error : undefined,
    });

    return Response.json(
      {
        success: false,
        error: { code: "INTERNAL_SERVER_ERROR", message: serverError.message },
      },
      { status: serverError.statusCode },
    );
  }
}
