import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { PodcastController } from './podcast.controller';
import { PodcastService } from './podcast.service';
import { ItunesService } from './itunes.service';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [PodcastController],
  providers: [PodcastService, ItunesService],
})
export class PodcastModule {}
