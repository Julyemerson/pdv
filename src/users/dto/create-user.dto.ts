import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'O nome de usuário é obrigatório',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty({
    message: 'O email é obrigatório',
  })
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password: string;
}
