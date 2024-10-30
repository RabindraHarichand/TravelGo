import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { RoleList, ROLE } from 'src/auth/enum/rol.enum';

export class User {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  role: ROLE;

  passwordHash: string;
}
