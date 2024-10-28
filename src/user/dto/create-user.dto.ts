import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { ROLE, RoleList } from 'src/auth/enum/rol.enum';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsEnum(RoleList, {
    message: `Valid user roles are ${RoleList}`,
  })
  role: ROLE;

  @IsString()
  @IsStrongPassword()
  passwordHash: string;
}
