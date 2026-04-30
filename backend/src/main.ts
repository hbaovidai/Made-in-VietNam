import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security: Ẩn thông tin server, chống XSS, clickjacking
  // crossOriginResourcePolicy: 'cross-origin' cho phép frontend (port khác) tải ảnh từ /uploads
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS - cho phép frontend gọi API
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://vieproduct.com.vn',
      'https://www.vieproduct.com.vn',
      'https://made-in-viet-nam.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 VIEproduct API running on http://localhost:${port}/api/v1`);
}
bootstrap();
