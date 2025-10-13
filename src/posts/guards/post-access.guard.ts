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
      // Verifica existência do post
      const exists = await this.prismaService.post.count({
        where: { id: postId },
      });
      if (exists === 0) {
        throw new NotFoundException('Post not found');
      }

      // Se o post é público e ativo, permite acesso livre
      const isPublicActive = await this.prismaService.post.count({
        where: {
          id: postId,
          type: 'PUBLIC' as any,
          status: 'ACTIVE' as any,
        } as any,
      });
      if (isPublicActive > 0) {
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
