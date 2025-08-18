import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ItunesSearchResponse } from './interfaces/itunes-response.interface';

@Injectable()
export class ItunesService {
  private readonly logger = new Logger(ItunesService.name);
  private readonly baseUrl = 'https://itunes.apple.com/search';

  constructor(private readonly httpService: HttpService) {}

  async searchPodcasts(keyword: string): Promise<ItunesSearchResponse> {
    try {
      const params = {
        term: keyword,
        media: 'podcast',
        entity: 'podcast',
        limit: 50,
      };

      this.logger.log(`Searching iTunes for keyword: ${keyword}`);
      
      const response = await firstValueFrom(
        this.httpService.get<ItunesSearchResponse>(this.baseUrl, { params })
      );

      this.logger.log(`Found ${response.data.resultCount} results for keyword: ${keyword}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error searching iTunes API: ${error.message}`, error.stack);
      throw new Error(`Failed to search iTunes API: ${error.message}`);
    }
  }
}

