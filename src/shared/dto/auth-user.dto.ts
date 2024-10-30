import { IsEmail, IsEnum, IsUUID } from 'class-validator';
import { ROLE, RoleList } from 'src/auth/enum/rol.enum';

export class AuthUser {
  @IsUUID(4)
  id: string;

  @IsEmail()
  email: string;

  @IsEnum(RoleList, {
    message: `Accepted role values are ${RoleList}`,
  })
  role: ROLE;
}
