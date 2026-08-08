import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureCors } from './cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureCors(app);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
