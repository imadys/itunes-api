import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { PodcastModule } from './podcasts/podcast.module';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    PodcastModule,
  ],
})
export class AppModule {}