import { Login } from "@/db/schema";
import { validateTurnstile } from "@/lib/validate-turnstile";
import { userService } from "./user/user.service";
import { HttpBadRequest, HttpForbidden, HttpNotFound } from "@httpx/exception";
import { verify } from "@node-rs/argon2";
import { sessionService } from "./session/session.service";

class AuthService {
  async authenticationUserLogin(data: Login & { remoteIp: string }) {
    const { email, password, token, remoteIp } = data;

    const turnstile = await validateTurnstile(token, remoteIp);

    const existingUser = await userService.findByEmail(email);

    if (!existingUser) {
      throw new HttpBadRequest("Not found email");
    }

    if (!existingUser.password) {
      throw new HttpNotFound("Password is not found");
    }

    const isValidPassword = await verify(existingUser.password, password);

    if (!isValidPassword) {
      throw new HttpForbidden("Password is not correct");
    }

    const sessionToken = await sessionService.generateSessionToken();
    const session = await sessionService.create(sessionToken, existingUser.id);
    await sessionService.setSessionTokenCookies(token, session.expiresAt);
  }
}

export const authService = new AuthService();
