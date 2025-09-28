import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  content: string;

  @IsInt()
  @IsNotEmpty()
  authorId: number;
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  content?: string;
}

export class SearchPostsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'O termo de busca não pode estar vazio' })
  title: string;
}
