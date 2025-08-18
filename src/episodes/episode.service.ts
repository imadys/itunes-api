import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Episode } from 'generated/prisma';

@Injectable()
export class EpisodeService {
  private readonly logger = new Logger(EpisodeService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getEpisodesByPodcast(podcastId: number, page: number = 1, limit: number = 10): Promise<{
    data: Episode[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    // Verify that the podcast exists
    const podcast = await this.prisma.podcast.findUnique({
      where: { id: podcastId },
    });

    if (!podcast) {
      throw new NotFoundException(`Podcast with ID ${podcastId} not found`);
    }

    const totalEpisodes = await this.prisma.episode.count({
      where: { podcastId },
    });

    const skip = (page - 1) * limit;
    const episodes = await this.prisma.episode.findMany({
      where: { podcastId },
      skip,
      take: limit,
      orderBy: { pubDate: 'desc' },
    });

    return {
      data: episodes,
      pagination: {
        page,
        limit,
        total: totalEpisodes,
        pages: Math.ceil(totalEpisodes / limit),
      },
    };
  }

  async getEpisodeById(id: number): Promise<Episode> {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
      include: {
        podcast: {
          select: {
            id: true,
            trackName: true,
            artistName: true,
            artworkUrl100: true,
          },
        },
      },
    });

    if (!episode) {
      throw new NotFoundException(`Episode with ID ${id} not found`);
    }

    return episode;
  }

}