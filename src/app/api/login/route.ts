import { createUserLoginSchema } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limiting";
import { HttpBadRequest, HttpTooManyRequests } from "@httpx/exception";
import { err, ok } from "@justmiracle/result";
import { headers } from "next/headers";
import z from "zod/v4";

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

    const body = await req.json().then(ok).catch(err);

    if (body.error) {
      throw new HttpBadRequest(body.error);
    }
    const validatedInput = createUserLoginSchema.safeParse(body.value);

    if (!validatedInput.success) {
      throw new HttpBadRequest(z.prettifyError(validatedInput.error));
    }

    const { email, password, token } = validatedInput.data;

    return req.json();
  } catch (error) {}
}
