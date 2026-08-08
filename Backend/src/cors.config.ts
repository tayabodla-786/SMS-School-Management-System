import type { INestApplication } from '@nestjs/common';

const normalizeOrigin = (origin: string) => origin.trim().replace(/\/$/, '');

export function getAllowedOrigins(): string[] {
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL.split(',').map(normalizeOrigin);
  }

  return ['http://localhost:5173'];
}

export function configureCors(app: INestApplication): void {
  const allowedOrigins = getAllowedOrigins();

  console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);

      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(normalizedOrigin)
      ) {
        callback(null, true);
        return;
      }

      console.warn(
        `CORS blocked request from "${origin}". Allowed: ${allowedOrigins.join(', ')}`,
      );
      callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
}
