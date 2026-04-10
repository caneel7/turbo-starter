import { db, PrismaClient } from '@turbo-starter/database'
import { ResourceNotFoundException } from '@/classes/errors';
import { UserSchema, UserType } from './users.schema';

export class UserService {

  constructor(
    private db: PrismaClient = db
  ) { }

  async findUserById(id: string): Promise<UserType> {
    const user = await this.db.user.findUnique({
      where: {
        id: id
      }
    });
    if(!user) throw new ResourceNotFoundException('Cannot Find User');

    return UserSchema.parse(user);
  }

  async listUsers(limit: number = 10, page: number = 1): Promise<UserType[]> {
    const users = await this.db.user.findMany({
      take: limit,
      skip: (page - 1) * limit
    });
    return users.map(user => UserSchema.parse(user));
  }

}
