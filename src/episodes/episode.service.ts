import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Episode } from 'generated/prisma';
import Parser from 'rss-parser';

@Injectable()
export class EpisodeService {
  private readonly logger = new Logger(EpisodeService.name);
  private readonly parser = new Parser();

  constructor(private readonly prisma: PrismaService) {}

  async getEpisodesByPodcastId(
    podcastId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Episode[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const existingEpisodesCount = await this.prisma.episode.count({
      where: { podcastId },
    });

    if (existingEpisodesCount === 0) {
      const podcast = await this.prisma.podcast.findUnique({
        where: { id: podcastId },
      });

      if (podcast && podcast.feedUrl) {
        await this.fetchAndSaveEpisodes(podcastId, podcast.feedUrl);
      }
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
      include: {
        podcast: true,
      },
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

  async getLatestEpisodeByPodcastId(podcastId: number): Promise<Episode | null> {
    const existingEpisodesCount = await this.prisma.episode.count({
      where: { podcastId },
    });

    if (existingEpisodesCount === 0) {
      const podcast = await this.prisma.podcast.findUnique({
        where: { id: podcastId },
      });

      if (podcast && podcast.feedUrl) {
        await this.fetchAndSaveEpisodes(podcastId, podcast.feedUrl);
      }
    }

    return this.prisma.episode.findFirst({
      where: { podcastId },
      orderBy: { pubDate: 'desc' },
      include: {
        podcast: true,
      },
    });
  }

  async getEpisodeById(id: number): Promise<Episode | null> {
    return this.prisma.episode.findUnique({
      where: { id },
      include: { podcast: true },
    });
  }

  async toggleEpisodeFavorite(id: number): Promise<Episode> {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
    });

    if (!episode) {
      throw new Error(`Episode with id ${id} not found`);
    }

    return this.prisma.episode.update({
      where: { id },
      data: {
        isFavorite: !episode.isFavorite,
      },
      include: { podcast: true },
    });
  }

  async getFavoriteEpisodes(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Episode[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const totalFavorites = await this.prisma.episode.count({
      where: { isFavorite: true },
    });

    const skip = (page - 1) * limit;
    const favorites = await this.prisma.episode.findMany({
      where: { isFavorite: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { podcast: true },
    });

    return {
      data: favorites,
      pagination: {
        page,
        limit,
        total: totalFavorites,
        pages: Math.ceil(totalFavorites / limit),
      },
    };
  }

  async fetchAndSaveEpisodes(
    podcastId: number,
    feedUrl: string,
  ): Promise<void> {
    try {
      const feed = await this.parser.parseURL(feedUrl);

      for (const item of feed.items) {
        if (!item.title || !item.pubDate) continue;

        const existingEpisode = await this.prisma.episode.findFirst({
          where: {
            podcastId,
            title: item.title,
          },
        });

        if (!existingEpisode) {
          await this.prisma.episode.create({
            data: {
              podcastId,
              title: item.title,
              audioUrl: item.enclosure?.url || null,
              duration: item.itunes?.duration || null,
              pubDate: new Date(item.pubDate),
              description: item.content || item.contentSnippet || null,
              shortDescription: item.contentSnippet || null,
              episodeNumber: item.itunes?.episode
                ? parseInt(item.itunes.episode)
                : null,
              episodeType: item.itunes?.episodeType || null,
              image: item.itunes?.image || null,
            },
          });
        }
      }
    } catch (error) {
      this.logger.error(
        `Error fetching episodes for podcast ${podcastId}: ${error.message}`,
      );
    }
  }
}