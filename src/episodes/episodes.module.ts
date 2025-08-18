import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EpisodeController } from './episode.controller';
import { EpisodeService } from './episode.service';

@Module({
  imports: [PrismaModule],
  controllers: [EpisodeController],
  providers: [EpisodeService],
  exports: [EpisodeService],
})
export class EpisodesModule {}