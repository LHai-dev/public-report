import { templateService } from "@/server/template";
import { NextRequest, NextResponse } from "next/server";
import {
  HttpBadRequest,
  HttpInternalServerError,
  isHttpException,
} from "@httpx/exception";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (!id || isNaN(numericId)) {
      throw new HttpBadRequest();
    }

    const result = await templateService.findOneById(numericId);

    return NextResponse.json({ data: result });
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
