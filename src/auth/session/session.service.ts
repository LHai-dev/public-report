import { cookies } from "next/headers";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import { db, DbType } from "@/db";
import { SessionRepository } from "./session.repository";
import { NewSession, Session } from "@/db/schema/session";
class SessionService {
  private readonly sessionRepository: SessionRepository;

  constructor(db: DbType) {
    this.sessionRepository = new SessionRepository(db);
  }

  async create(sessionId: string, userId: number): Promise<Session> {
    const SESSION_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000; //THIRTY_DAYS_IN_MS
    const sessionExpiresAt = new Date(Date.now() + SESSION_EXPIRATION_MS);

    const session: NewSession = {
      userId,
      token: sessionId,
      expiresAt: sessionExpiresAt,
    };

    return this.sessionRepository.create(session);
  }

  async setSessionTokenCookies(token: string, expiresAt: Date): Promise<void> {
    (await cookies()).set("session", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    });
  }

  async generateSessionToken(): Promise<string> {
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes);
    return token;
  }
}

export const sessionService = new SessionService(db);
