import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // transform:false, // check performance, best in false
    }),
  );
  await app.listen(3000);
}
bootstrap();

// npx typeorm migration:create -n CoffeeRefactor
/* RUNNING MIGRATIONS */

/**
 * 💡 Remember 💡
 * You must BUILD your Nest project (so that everything is output to the `/dist/` folder,
 * before a Migration can run, it needs compilated files.
 */

// Compile project first
//npm run build

// Run migration(s)
//npx typeorm migration:run

// REVERT migration(s)
// npx typeorm migration:revert

// Let TypeOrm generate migrations (for you)
// npx typeorm migration:generate -n SchemaSync
