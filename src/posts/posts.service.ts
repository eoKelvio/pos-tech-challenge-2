import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, PostStatus } from './dto/posts';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPosts() {
    return this.prismaService.post.findMany();
  }

  async getPostById(id: number) {
    const post = await this.prismaService.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async createPost(data: CreatePostDto) {
    const author = await this.prismaService.user.findUnique({
      where: { id: data.authorId },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const post = await this.prismaService.post.create({ data });

    if (!post) {
      throw new NotFoundException('Post not created');
    }

    return post;
  }

  async updatePost(id: number, data: UpdatePostDto) {
    const existingPost = await this.prismaService.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    const post = await this.prismaService.post.update({
      where: { id },
      data,
    });

    if (!post) {
      throw new NotFoundException('Post not updated');
    }

    return post;
  }

  async deletePost(id: number) {
    const existingPost = await this.prismaService.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    // Verifica se o post está inativo antes de permitir a exclusão
    if ((existingPost as any).status !== PostStatus.INACTIVE) {
      throw new BadRequestException(
        'Only inactive posts can be deleted. Please deactivate the post first.',
      );
    }

    await this.prismaService.post.delete({ where: { id } });

    return { message: 'Post deleted successfully' };
  }

  async searchPosts(title: string) {
    return this.prismaService.post.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
    });
  }
}
