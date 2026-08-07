import { DbType } from "@/db";
import { NewSession, Session, sessionTable } from "@/db/schema/session";

export class SessionRepository {
  constructor(private readonly db: DbType) {}

  async create(data: NewSession): Promise<Session> {
    const [insertSession] = await this.db
      .insert(sessionTable)
      .values(data)
      .returning();

    return insertSession;
  }

  
}
