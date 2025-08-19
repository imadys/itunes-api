import { Module } from '@nestjs/common';
import { EpisodeController } from './episode.controller';
import { EpisodeService } from './episode.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EpisodeController],
  providers: [EpisodeService],
  exports: [EpisodeService],
})
export class EpisodeModule {}