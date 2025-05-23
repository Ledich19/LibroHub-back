import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { FastifyRequest, FastifyReply } from 'fastify';

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  let token: string | undefined;

  // 1. Проверяем Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
    console.log('Token source: Bearer');
  }

  // 2. Если нет Bearer, проверяем куку session
  if (!token) {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    token = cookies.session;
    if (token) console.log('Token source: Cookie');
  }

  // 3. Если токен есть, верифицируем его
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      req.userId = decoded.userId;
      console.log('User ID:', decoded.userId);
    } catch (err) {
      console.error('JWT verification failed:', err);
      // Не кидаем ошибку, чтобы не ломать открытые эндпоинты
      req.userId = undefined;
    }
  } else {
    console.log('No token provided');
    req.userId = undefined; // Для открытых эндпоинтов
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    userId?: number;
  }
}