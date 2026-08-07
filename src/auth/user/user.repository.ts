import { DbType } from "@/db";
import { User, userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export class UserRepository {
  constructor(private readonly db: DbType) {}

  async findByEmail(email: string): Promise<User | null> {
    const [result] = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    return result;
  }

  async findUserHashPasswordById(userId: number): Promise<string | null> {
    const [user] = await this.db
      .select({ password: userTable.password })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    const { password } = user;

    return password;
  }
}
