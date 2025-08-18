import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ItunesService } from './itunes.service';
import { ItunesResult } from './interfaces/itunes-response.interface';
import { Podcast } from 'generated/prisma';

@Injectable()
export class PodcastService {
  private readonly logger = new Logger(PodcastService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly itunesService: ItunesService,
  ) {}

  async searchAndStorePodcasts(keyword: string): Promise<{
    message: string;
    totalFound: number;
    newPodcasts: number;
    existingPodcasts: number;
    podcasts: Podcast[];
  }> {
    try {
      // Search iTunes API
      const itunesResponse = await this.itunesService.searchPodcasts(keyword);
      
      if (itunesResponse.resultCount === 0) {
        return {
          message: `No podcasts found for keyword: ${keyword}`,
          totalFound: 0,
          newPodcasts: 0,
          existingPodcasts: 0,
          podcasts: [],
        };
      }

      // Process and store results
      const results = await this.processPodcastResults(itunesResponse.results, keyword);
      
      return {
        message: `Successfully processed ${itunesResponse.resultCount} podcasts for keyword: ${keyword}`,
        totalFound: itunesResponse.resultCount,
        newPodcasts: results.newCount,
        existingPodcasts: results.existingCount,
        podcasts: results.podcasts,
      };
    } catch (error) {
      this.logger.error(`Error in searchAndStorePodcasts: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async processPodcastResults(results: ItunesResult[], searchKeyword: string): Promise<{
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
          this.logger.log(`Updated existing podcast: ${result.trackName}`);
        } else {
          // Create new podcast
          const newPodcast = await this.prisma.podcast.create({
            data: this.mapItunesResultToPodcast(result, searchKeyword),
          });
          podcasts.push(newPodcast);
          newCount++;
          this.logger.log(`Created new podcast: ${result.trackName}`);
        }
      } catch (error) {
        this.logger.error(`Error processing podcast ${result.trackId}: ${error.message}`);
        // Continue processing other podcasts
        continue;
      }
    }

    return { podcasts, newCount, existingCount };
  }

  private mapItunesResultToPodcast(result: ItunesResult, searchKeyword: string) {
    return {
      trackId: result.trackId,
      trackName: result.trackName,
      artistName: result.artistName,
      collectionName: result.collectionName || null,
      trackViewUrl: result.trackViewUrl,
      artworkUrl30: result.artworkUrl30 || null,
      artworkUrl60: result.artworkUrl60 || null,
      artworkUrl100: result.artworkUrl100 || null,
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

  async getAllPodcasts(): Promise<Podcast[]> {
    const podcasts = await this.prisma.podcast.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (podcasts.length === 0) {
      this.logger.log('No podcasts found in database, searching iTunes for "thmanyah"');
      const searchResult = await this.searchAndStorePodcasts('thmanyah');
      return searchResult.podcasts;
    }

    return podcasts;
  }

  async getPodcastsByKeyword(keyword: string): Promise<Podcast[]> {
    return this.prisma.podcast.findMany({
      where: {
        searchKeyword: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPodcastById(id: number): Promise<Podcast | null> {
    return this.prisma.podcast.findUnique({
      where: { id },
    });
  }

  async deletePodcast(id: number): Promise<void> {
    await this.prisma.podcast.delete({
      where: { id },
    });
  }
}
