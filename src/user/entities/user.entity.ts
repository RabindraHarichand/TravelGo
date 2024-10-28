import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';
import { RoleList, ROLE } from 'src/auth/enum/rol.enum';

export class User {
  @IsUUID(4)
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsEnum(RoleList, {
    message: `Valid roles are ${RoleList}`,
  })
  role: ROLE;

  @IsString()
  passwordHash: string;
}
