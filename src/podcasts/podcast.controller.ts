import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PodcastService } from './podcast.service';
import { SearchPodcastDto } from './dto/search-podcast.dto';
import { PodcastResponseDto } from './dto/podcast-response.dto';

@ApiTags('podcasts')
@Controller('podcasts')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search podcasts from iTunes and store in database',
    description:
      'Searches iTunes API for podcasts using the provided keyword and stores the results in the database. Example: searching for "فنجان" will find Arabic podcasts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Search completed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        totalFound: { type: 'number' },
        newPodcasts: { type: 'number' },
        existingPodcasts: { type: 'number' },
        podcasts: {
          type: 'array',
          items: { $ref: '#/components/schemas/PodcastResponseDto' },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  async searchPodcasts(@Body() searchDto: SearchPodcastDto) {
    return this.podcastService.searchAndStorePodcasts(searchDto.keyword);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stored podcasts' })
  @ApiResponse({
    status: 200,
    description: 'List of all podcasts',
    type: [PodcastResponseDto],
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'Filter podcasts by search keyword',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default: 10)',
    type: Number,
  })
  async getAllPodcasts(
    @Query('keyword') keyword?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageNum = page && page > 0 ? page : 1;
    const limitNum = limit && limit > 0 ? Math.min(limit, 100) : 10;

    if (keyword) {
      return this.podcastService.getPodcastsByKeyword(
        keyword,
        pageNum,
        limitNum,
      );
    }
    return this.podcastService.getAllPodcasts(pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific podcast by ID' })
  @ApiParam({ name: 'id', description: 'Podcast ID' })
  @ApiResponse({
    status: 200,
    description: 'Podcast details',
    type: PodcastResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Podcast not found' })
  async getPodcastById(@Param('id', ParseIntPipe) id: number) {
    return this.podcastService.getPodcastById(id);
  }

  @Post(':id/favorite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle podcast favorite status' })
  @ApiParam({ name: 'id', description: 'Podcast ID' })
  @ApiResponse({
    status: 200,
    description: 'Podcast favorite status toggled successfully',
    type: PodcastResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Podcast not found' })
  async togglePodcastFavorite(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.podcastService.togglePodcastFavorite(id);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get all favorite podcasts' })
  @ApiResponse({
    status: 200,
    description: 'List of favorite podcasts',
    type: [PodcastResponseDto],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default: 10)',
    type: Number,
  })
  async getFavoritePodcasts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageNum = page && page > 0 ? page : 1;
    const limitNum = limit && limit > 0 ? Math.min(limit, 100) : 10;
    return this.podcastService.getFavoritePodcasts(pageNum, limitNum);
  }

}
