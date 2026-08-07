import { db, DbType } from "@/db";
import { UserRepository } from "./user.repository";

class UserService {
  private readonly userRepository: UserRepository;

  constructor(private readonly db: DbType) {
    this.userRepository = new UserRepository(db);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
  async findUserHashPasswordById(userId: number) {
    return this.userRepository.findUserHashPasswordById(userId);
  }
}

export const userService = new UserService(db);
