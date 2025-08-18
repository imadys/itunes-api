import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ItunesSearchResponse } from './interfaces/itunes-response.interface';

@Injectable()
export class ItunesService {
  private readonly logger = new Logger(ItunesService.name);
  private readonly searchUrl = 'https://itunes.apple.com/search';
  private readonly lookupUrl = 'https://itunes.apple.com/lookup';

  constructor(private readonly httpService: HttpService) {}

  async search(
    term: string,
    media?: string,
    entity?: string,
    limit: number = 50,
  ): Promise<ItunesSearchResponse> {
    try {
      const params: any = {
        term,
        limit,
      };

      if (media) params.media = media;
      if (entity) params.entity = entity;

      const response = await firstValueFrom(
        this.httpService.get<ItunesSearchResponse>(this.searchUrl, { params }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Error searching iTunes API: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to search iTunes API: ${error.message}`);
    }
  }

  async searchPodcasts(keyword: string): Promise<ItunesSearchResponse> {
    return this.search(keyword, 'podcast', 'podcast');
  }

  async lookup(id: number): Promise<ItunesSearchResponse> {
    try {
      const params = {
        id,
      };

      const response = await firstValueFrom(
        this.httpService.get<ItunesSearchResponse>(this.lookupUrl, { params }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Error looking up iTunes API: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to lookup iTunes API: ${error.message}`);
    }
  }
}
