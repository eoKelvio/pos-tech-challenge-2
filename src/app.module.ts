import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [AuthModule, PostsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
