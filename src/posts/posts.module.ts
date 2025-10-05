import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { PostAccessGuard } from './guards/post-access.guard';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService, PostAccessGuard],
})
export class PostsModule {}
