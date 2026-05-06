import { DbType } from "@/db";
import { NewTemplate, Template, templateTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export class TemplateRepository {
  constructor(private readonly db: DbType) {}

  async getOneById(id: number): Promise<Template | null> {
    const result = await this.db.query.templateTable.findFirst({
      where: eq(templateTable.id, id),
    });

    return result || null;
  }

  async getOneByPhoneNumber(phoneNumber: string): Promise<Template | null> {
    const result = await this.db.query.templateTable.findFirst({
      where: eq(templateTable.phoneNumber, phoneNumber),
    });

    return result || null;
  }

  async create(data: NewTemplate): Promise<Template> {
    const [template] = await this.db
      .insert(templateTable)
      .values(data)
      .returning();
    return template;
  }

  async getAll(): Promise<Template[]> {
    const template = await this.db
      .select()
      .from(templateTable)
      .orderBy(desc(templateTable.createdAt))
      .$dynamic();
    return template;
  }
}
