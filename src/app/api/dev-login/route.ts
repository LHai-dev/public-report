import { sessionService } from "@/auth/session/session.service";
import { userService } from "@/auth/user/user.service";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "development") {
    return new Response(null, { status: 400 });
  }

  const email = new URL(request.url).searchParams.get("email");

  if (!email) {
    return new Response("pass ?email=<user email>", { status: 400 });
  }

  const user = await userService.findByEmail(email);

  if (!user) {
    return new Response(`No user with this email${email}`, { status: 400 });
  }

  const sessionToken = await sessionService.generateSessionToken();
  const session = await sessionService.create(sessionToken, user.id);
  await sessionService.setSessionTokenCookies(sessionToken, session.expiresAt);

  return new Response(null, { status: 302, headers: { Location: "/" } });
}
