import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AppModule } from '../src/app.module';
import { configureCors } from '../src/cors.config';

const server = express();
let isInitialized = false;
let initPromise: Promise<void> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  configureCors(app);

  await app.init();
  isInitialized = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isInitialized) {
    if (!initPromise) {
      initPromise = bootstrap();
    }
    await initPromise;
  }

  server(req, res);
}
