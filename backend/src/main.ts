import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Compression: Nén response giảm ~70-80% bandwidth
  app.use(compression());

  // Security: Ẩn thông tin server, chống XSS, clickjacking
  // crossOriginResourcePolicy: 'cross-origin' cho phép frontend (port khác) tải ảnh từ /uploads
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('/');

  // CORS - cho phép frontend gọi API
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://fixweapon.meltedwind.com',
      'https://fixweapon.vercel.app'
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
  console.log(`🚀 VIEproduct API running on ${port}`);
}
bootstrap();
