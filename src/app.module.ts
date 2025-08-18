import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { PodcastModule } from './podcasts/podcast.module';
import { EpisodesModule } from './episodes/episodes.module';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    PodcastModule,
    EpisodesModule,
  ],
})
export class AppModule {}