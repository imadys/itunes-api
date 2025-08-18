import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ItunesModule } from '../itunes/itunes.module';
import { PodcastController } from './podcast.controller';
import { EpisodeController } from './episode.controller';
import { PodcastService } from './podcast.service';

@Module({
  imports: [PrismaModule, ItunesModule],
  controllers: [PodcastController, EpisodeController],
  providers: [PodcastService],
})
export class PodcastModule {}
