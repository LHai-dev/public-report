import { db, DbType } from "@/db";
import { TemplateRepository } from "./template.repository";
import { NewTemplate } from "@/db/schema";
import { HttpConflict, HttpNotFound } from "@httpx/exception";

export class TemplateService {
  private readonly repository: TemplateRepository;
  constructor(db: DbType) {
    this.repository = new TemplateRepository(db);
  }
  async create(data: NewTemplate) {
    const existingPhoneNumber = await this.findOneByPhoneNumber(
      data.phoneNumber,
    );

    if (existingPhoneNumber) {
      throw new HttpConflict(
        ` "${existingPhoneNumber.phoneNumber}" already exists`,
      );
    }

    return await this.repository.create(data);
  }

  async findOneById(id: number) {
    const result = await this.repository.getOneById(id);
    if (!result) {
      throw new HttpNotFound("Template not found");
    }
    return result;
  }

  async findOneByPhoneNumber(phoneNumber: string) {
    return await this.repository.getOneByPhoneNumber(phoneNumber);
  }

  async getAll() {
    return await this.repository.getAll();
  }
}

export const templateService = new TemplateService(db);
