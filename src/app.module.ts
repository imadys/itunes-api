import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { PodcastModule } from './podcasts/podcast.module';
import { EpisodeModule } from './episodes/episode.module';

@Module({
  imports: [HttpModule, PrismaModule, PodcastModule, EpisodeModule],
})
export class AppModule {}
