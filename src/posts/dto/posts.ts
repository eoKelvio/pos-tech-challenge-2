import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'My first post',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is the content of my post...',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  content: string;

  @ApiProperty({
    description: 'Post author ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  authorId: number;
}

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Post title',
    example: 'Updated title',
    minLength: 3,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @ApiPropertyOptional({
    description: 'Post content',
    example: 'Updated content...',
    minLength: 3,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  content?: string;
}

export class SearchPostsDto {
  @ApiProperty({
    description: 'Search term for the title',
    example: 'technology',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Search term cannot be empty' })
  title: string;
}
