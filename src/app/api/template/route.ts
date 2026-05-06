import { TemplateInsertSchema } from "@/db/schema";
import { templateService } from "@/server/template";
import {
  HttpBadRequest,
  HttpInternalServerError,
  isHttpException,
} from "@httpx/exception";
import { err, ok } from "@justmiracle/result";
import z from "zod/v4";
import { Result } from "better-result";

export async function POST(req: Request) {
  try {
    // const body = await req.json().then(ok).catch(err);

    // if (body.error) {
    //   throw new HttpBadRequest(body.error);
    // }

    const parsed = await Result.tryPromise(() => req.json());

    if (parsed.isErr()) {
      throw new HttpBadRequest(parsed.error.message);
    }

    const validatedInput = TemplateInsertSchema.safeParse(parsed.value);

    if (!validatedInput.success) {
      throw new HttpBadRequest(z.prettifyError(validatedInput.error));
    }

    const { commune, name, birth, percentage, phoneNumber } =
      validatedInput.data;

    const result = await templateService.create({
      commune,
      name,
      birth,
      percentage,
      phoneNumber,
    });

    return Response.json({ success: true, message: "", data: result });
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
