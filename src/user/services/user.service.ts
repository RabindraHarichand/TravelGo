import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { ROLE } from 'src/auth/enum/rol.enum';
import { PaginatedOutputDto, PaginationDto } from 'src/shared/dto';
import { passwordHashingUtil } from 'src/shared/utils/password-hashing.util';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verifies if a user exists, if user exists then isUser is false, else isUser is true
    const isUser = await this.userRepository.existsByEmail(createUserDto.email);

    if (!isUser)
      throw new ConflictException({
        message: `User with email: ${createUserDto.email} already exists`,
      });

    const userToSave: Omit<User, 'id'> = {
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      role: createUserDto.role,
      passwordHash: passwordHashingUtil.hashPassword(
        createUserDto.passwordHash,
      ),
    };

    try {
      const user = await this.userRepository.create(userToSave);
      return user;
    } catch (error) {
      throw new InternalServerErrorException({
        message: `User ${createUserDto.email} could not be created`,
      });
    }
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedOutputDto<User>> {
    const { page, limit } = paginationDto;
    const totalPages = await this.userRepository.count();

    const lastPage = Math.ceil(totalPages / limit);
    const users = await this.userRepository.findAll(paginationDto);

    return {
      data: users,
      meta: {
        total: totalPages,
        lastPage: lastPage,
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneById(id);
    return { ...user, role: user.role as unknown as ROLE };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.update(id, updateUserDto);

    if (!user)
      throw new BadRequestException({
        message: `User ${updateUserDto.email} could not be updated`,
      });

    return user;
  }

  async remove(id: string) {
    //verify if user exists
    const userExists = await this.userRepository.existsById(id);
    if (!userExists)
      throw new NotFoundException({
        messsage: `User could not be deleted due to verification errors`,
      });

    try {
      await this.userRepository.removeUserById(id);
    } catch {
      throw new InternalServerErrorException(
        `User could not be deleted because an unexpected error occurred`,
      );
    }
  }
}
