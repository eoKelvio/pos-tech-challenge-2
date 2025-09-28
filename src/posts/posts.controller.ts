import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/posts';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts() {
    return this.postsService.getPosts();
  }

  @Get('search')
  async searchPosts(@Query('title') title: string) {
    return this.postsService.searchPosts(title);
  }

  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createPost(@Body() body: CreatePostDto) {
    return this.postsService.createPost(body);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
