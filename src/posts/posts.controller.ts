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
import { PostAccessGuard } from './guards/post-access.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({
    summary: '🔓 List active public posts',
    description: 'Returns only posts with ACTIVE status and PUBLIC type.',
  })
  @ApiResponse({
    status: 200,
    description: '✅ List of active public posts returned successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Public Post Title' },
          content: { type: 'string', example: 'Post content...' },
          type: { type: 'string', enum: ['PUBLIC'], example: 'PUBLIC' },
          status: { type: 'string', enum: ['ACTIVE'], example: 'ACTIVE' },
          authorId: { type: 'number', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getActivePosts() {
    return this.postsService.getActivePosts();
  }

  @UseGuards(AuthGuard)
  @Get('all')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '🔒 List all posts (authenticated)',
    description: 'Returns all posts (active and inactive).',
  })
  @ApiResponse({
    status: 200,
    description: '✅ All posts returned successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Post Title' },
          content: { type: 'string', example: 'Post content...' },
          type: {
            type: 'string',
            enum: ['PUBLIC', 'PRIVATE'],
            example: 'PUBLIC',
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'INACTIVE'],
            example: 'ACTIVE',
          },
          authorId: { type: 'number', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '🔒 Unauthorized - Authentication required',
  })
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get('search')
  @ApiOperation({
    summary: '🔓 Search active public posts by title',
    description:
      'Searches for posts with ACTIVE status and PUBLIC type matching the title.',
  })
  @ApiQuery({
    name: 'title',
    required: true,
    description: 'Title to search for',
    example: 'technology',
  })
  @ApiResponse({
    status: 200,
    description: '✅ Active public posts found',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Technology Post' },
          content: { type: 'string', example: 'Post content...' },
          type: { type: 'string', enum: ['PUBLIC'], example: 'PUBLIC' },
          status: { type: 'string', enum: ['ACTIVE'], example: 'ACTIVE' },
          authorId: { type: 'number', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async searchPosts(@Query('title') title: string) {
    return this.postsService.searchPosts(title);
  }

  @UseGuards(PostAccessGuard)
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '🔓🔒 Get post by ID (conditional access)',
    description: `Returns a post by ID with conditional authentication requirements.

🔓 Public Access: Posts with PUBLIC type and ACTIVE status can be accessed without authentication.

🔒 Authentication Required: Posts with PRIVATE type or INACTIVE status require valid JWT token.

Usage Examples:
- GET /posts/1 - Access public active post without token
- GET /posts/2 + Authorization header - Access private/inactive post with token`,
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Post found and returned successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'My Post Title' },
        content: { type: 'string', example: 'Post content...' },
        type: {
          type: 'string',
          enum: ['PUBLIC', 'PRIVATE'],
          example: 'PUBLIC',
        },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE'],
          example: 'ACTIVE',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '🔒 Authentication required for private/inactive posts',
  })
  @ApiResponse({
    status: 404,
    description: '❌ Post not found',
  })
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '🔒 Create new post',
    description: 'Creates a new post.',
  })
  @ApiResponse({
    status: 201,
    description: '✅ Post created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'My New Post' },
        content: { type: 'string', example: 'Post content...' },
        type: {
          type: 'string',
          enum: ['PUBLIC', 'PRIVATE'],
          example: 'PUBLIC',
        },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE'],
          example: 'ACTIVE',
        },
        authorId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '🔒 Unauthorized - Authentication required',
  })
  async createPost(@Body() body: CreatePostDto) {
    return this.postsService.createPost(body);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '🔒 Update post',
    description: 'Updates an existing post.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID to update',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '✅ Post updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Updated Post Title' },
        content: { type: 'string', example: 'Updated content...' },
        type: {
          type: 'string',
          enum: ['PUBLIC', 'PRIVATE'],
          example: 'PUBLIC',
        },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE'],
          example: 'ACTIVE',
        },
        authorId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '🔒 Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: '❌ Post not found',
  })
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '🔒 Delete post',
    description: 'Deletes a post. Only inactive posts can be deleted.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '✅ Post deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Post deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '⚠️ Bad request - Only inactive posts can be deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Only inactive posts can be deleted. Please deactivate the post first.',
        },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '🔒 Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: '❌ Post not found',
  })
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
