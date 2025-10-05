import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtConstants } from 'src/auth/constants';
import { PostType, PostStatus } from '../dto/posts';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
export class PostAccessGuard implements CanActivate {
  private authGuard: AuthGuard;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {
    this.authGuard = new AuthGuard(jwtService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const postId = parseInt(request.params.id);

    if (!postId || isNaN(postId)) {
      throw new NotFoundException('Invalid post ID');
    }

    try {
      // Busca o post no banco de dados
      const post = await this.prismaService.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // Se o post é público e ativo, permite acesso livre
      if (post.type === PostType.PUBLIC && post.status === PostStatus.ACTIVE) {
        return true;
      }

      // Se o post é privado ou inativo, verifica se tem token primeiro
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException(
          'Authentication required to access private or inactive posts',
        );
      }

      // Se tem token, usa o AuthGuard para verificar se é válido
      return this.authGuard.canActivate(context);
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.error('PostAccessGuard error:', error);
      throw new UnauthorizedException('Error accessing post');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
