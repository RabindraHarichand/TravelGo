import { Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { ROLE } from 'src/auth/enum/rol.enum';
import { PaginationDto } from 'src/shared/dto';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

export class UserRepository extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('UserRepository');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.user.create({
      data: createUserDto,
    });

    return { ...user, role: user.role as unknown as ROLE };
  }

  async findAll(paginationDto: PaginationDto): Promise<User[]> {
    const users = await this.user.findMany({
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    });

    return users.map((user) => ({
      ...user,
      role: user.role as unknown as ROLE,
    }));
  }

  async count(): Promise<number> {
    return await this.user.count();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.user.findFirst({
      where: { id },
    });

    return { ...user, role: user.role as unknown as ROLE };
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.user.findFirst({
      where: { email },
    });

    if (!user) {
      return true;
    }
    return false;
  }

  async existsById(id: string): Promise<boolean> {
    const user = await this.user.findFirst({
      where: { id },
    });

    if (!user) {
      return false;
    }
    return true;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.user.update({
      where: { id },
      data: updateUserDto,
    });

    return { ...user, role: user.role as unknown as ROLE };
  }

  async removeUserById(id: string): Promise<void> {
    await this.user.delete({
      where: { id },
    });
  }
}
