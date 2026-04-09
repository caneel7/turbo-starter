import { db, PrismaClient } from '@turbo-starter/database'
import { ResourceNotFoundException } from '@/classes/errors';
import { UserSchema, UserType } from './users.schema';

export class UserService {

  constructor(
    private db: PrismaClient = db
  ) { }

  async findUserById(id: string): Promise<UserType> {
    const user = this.db.user.findUnique({
      where: {
        id: id
      }
    });

    if(!user) throw new ResourceNotFoundException('Cannot Find User');

    return UserSchema.parse(user);
  }

}
