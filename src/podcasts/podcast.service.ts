import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ItunesService } from '../itunes/itunes.service';
import { ItunesResult } from '../itunes/interfaces/itunes-response.interface';
import { Podcast, Episode } from 'generated/prisma';
import Parser from 'rss-parser';

@Injectable()
export class PodcastService {
  private readonly logger = new Logger(PodcastService.name);
  private readonly parser = new Parser();

  constructor(
    private readonly prisma: PrismaService,
    private readonly itunes: ItunesService,
  ) {}

  async searchAndStorePodcasts(keyword: string): Promise<{
    message: string;
    totalFound: number;
    newPodcasts: number;
    existingPodcasts: number;
    data: Podcast[];
  }> {
    try {
      // Search iTunes API
      const itunesResponse = await this.itunes.searchPodcasts(keyword);

      if (itunesResponse.resultCount === 0) {
        return {
          message: `No podcasts found for keyword: ${keyword}`,
          totalFound: 0,
          newPodcasts: 0,
          existingPodcasts: 0,
          data: [],
        };
      }

      // Process and store results
      const results = await this.processPodcastResults(
        itunesResponse.results,
        keyword,
      );

      return {
        message: `Successfully processed ${itunesResponse.resultCount} podcasts for keyword: ${keyword}`,
        totalFound: itunesResponse.resultCount,
        newPodcasts: results.newCount,
        existingPodcasts: results.existingCount,
        data: results.podcasts,
      };
    } catch (error) {
      this.logger.error(
        `Error in searchAndStorePodcasts: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async processPodcastResults(
    results: ItunesResult[],
    searchKeyword: string,
  ): Promise<{
    podcasts: Podcast[];
    newCount: number;
    existingCount: number;
  }> {
    const podcasts: Podcast[] = [];
    let newCount = 0;
    let existingCount = 0;

    for (const result of results) {
      try {
        // Check if podcast already exists
        const existingPodcast = await this.prisma.podcast.findUnique({
          where: { trackId: result.trackId },
        });

        if (existingPodcast) {
          // Update existing podcast
          const updatedPodcast = await this.prisma.podcast.update({
            where: { trackId: result.trackId },
            data: this.mapItunesResultToPodcast(result, searchKeyword),
          });
          podcasts.push(updatedPodcast);
          existingCount++;
        } else {
          // Create new podcast
          const newPodcast = await this.prisma.podcast.create({
            data: this.mapItunesResultToPodcast(result, searchKeyword),
          });
          podcasts.push(newPodcast);
          newCount++;
        }
      } catch (error) {
        this.logger.error(
          `Error processing podcast ${result.trackId}: ${error.message}`,
        );
        // Continue processing other podcasts
        continue;
      }
    }

    return { podcasts, newCount, existingCount };
  }

  private mapItunesResultToPodcast(
    result: ItunesResult,
    searchKeyword: string,
  ) {
    return {
      trackId: result.trackId,
      trackName: result.trackName,
      artistName: result.artistName,
      collectionName: result.collectionName || null,
      trackViewUrl: result.trackViewUrl,
      artworkUrl30: result.artworkUrl30 || null,
      artworkUrl60: result.artworkUrl60 || null,
      artworkUrl100: result.artworkUrl100 || null,
      artworkUrl600: result.artworkUrl600 || null,
      collectionPrice: result.collectionPrice || null,
      trackPrice: result.trackPrice || null,
      releaseDate: result.releaseDate ? new Date(result.releaseDate) : null,
      collectionExplicitness: result.collectionExplicitness || null,
      trackExplicitness: result.trackExplicitness || null,
      trackCount: result.trackCount || null,
      country: result.country,
      currency: result.currency || null,
      primaryGenreName: result.primaryGenreName || null,
      contentAdvisoryRating: result.contentAdvisoryRating || null,
      feedUrl: result.feedUrl || null,
      genres: result.genres || [],
      searchKeyword,
    };
  }

  async getAllPodcasts(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Podcast[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const totalPodcasts = await this.prisma.podcast.count();

    this.logger.log(`Total podcasts: ${totalPodcasts}`);

    // If no podcasts found, automatically search for "thmanyah" and return results
    if (totalPodcasts === 0) {
      const searchResult = await this.searchAndStorePodcasts('thmanyah');
      const total = searchResult.data.length;
      const skip = (page - 1) * limit;
      const paginatedPodcasts = searchResult.data.slice(skip, skip + limit);

      return {
        data: paginatedPodcasts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }

    const skip = (page - 1) * limit;
    const podcasts = await this.prisma.podcast.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: podcasts,
      pagination: {
        page,
        limit,
        total: totalPodcasts,
        pages: Math.ceil(totalPodcasts / limit),
      },
    };
  }

  async getPodcastsByKeyword(
    keyword: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Podcast[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const totalPodcasts = await this.prisma.podcast.count({
      where: {
        searchKeyword: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
    });

    const skip = (page - 1) * limit;
    const podcasts = await this.prisma.podcast.findMany({
      where: {
        searchKeyword: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: podcasts,
      pagination: {
        page,
        limit,
        total: totalPodcasts,
        pages: Math.ceil(totalPodcasts / limit),
      },
    };
  }

  async getPodcastById(id: number): Promise<Podcast | null> {
    return this.prisma.podcast.findUnique({
      where: { id },
    });
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
    // Check if episodes exist for this podcast
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

  async getEpisodeById(id: number): Promise<Episode | null> {
    return this.prisma.episode.findUnique({
      where: { id },
      include: { podcast: true },
    });
  }
}
