import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { PostAccessGuard } from './guards/post-access.guard';
import { SearchAccessGuard } from './guards/search-access.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService, PrismaService, PostAccessGuard, SearchAccessGuard],
})
export class PostsModule {}
