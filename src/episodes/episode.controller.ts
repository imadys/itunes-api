import { Controller, Get, Post, Param, ParseIntPipe, Query, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EpisodeService } from './episode.service';
import { EpisodeResponseDto } from './dto/episode-response.dto';

@ApiTags('episodes')
@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific episode by ID' })
  @ApiParam({ name: 'id', description: 'Episode ID' })
  @ApiResponse({
    status: 200,
    description: 'Episode details with podcast information',
    type: EpisodeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Episode not found' })
  async getEpisodeById(@Param('id', ParseIntPipe) id: number) {
    return this.episodeService.getEpisodeById(id);
  }

  @Get('podcast/:podcastId')
  @ApiOperation({ summary: 'Get episodes for a specific podcast' })
  @ApiParam({ name: 'podcastId', description: 'Podcast ID' })
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
  @ApiResponse({
    status: 200,
    description: 'List of episodes for the podcast',
    type: [EpisodeResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Podcast not found' })
  async getEpisodesByPodcastId(
    @Param('podcastId', ParseIntPipe) podcastId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageNum = page && page > 0 ? page : 1;
    const limitNum = limit && limit > 0 ? Math.min(limit, 100) : 10;
    return this.episodeService.getEpisodesByPodcastId(podcastId, pageNum, limitNum);
  }

  @Get('podcast/:podcastId/latest')
  @ApiOperation({ summary: 'Get the latest episode for a specific podcast' })
  @ApiParam({ name: 'podcastId', description: 'Podcast ID' })
  @ApiResponse({
    status: 200,
    description: 'Latest episode for the podcast',
    type: EpisodeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Podcast not found or no episodes available' })
  async getLatestEpisodeByPodcastId(@Param('podcastId', ParseIntPipe) podcastId: number) {
    return this.episodeService.getLatestEpisodeByPodcastId(podcastId);
  }

  @Post(':id/favorite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle episode favorite status' })
  @ApiParam({ name: 'id', description: 'Episode ID' })
  @ApiResponse({
    status: 200,
    description: 'Episode favorite status toggled successfully',
    type: EpisodeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Episode not found' })
  async toggleEpisodeFavorite(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.episodeService.toggleEpisodeFavorite(id);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get all favorite episodes' })
  @ApiResponse({
    status: 200,
    description: 'List of favorite episodes',
    type: [EpisodeResponseDto],
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
  async getFavoriteEpisodes(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageNum = page && page > 0 ? page : 1;
    const limitNum = limit && limit > 0 ? Math.min(limit, 100) : 10;
    return this.episodeService.getFavoriteEpisodes(pageNum, limitNum);
  }
}
