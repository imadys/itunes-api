import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { EpisodeService } from './episode.service';
import { EpisodeResponseDto } from './dto/episode-response.dto';

@ApiTags('episodes')
@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get('podcast/:podcastId')
  @ApiOperation({ 
    summary: 'Get episodes by podcast',
    description: 'Retrieve all episodes for a specific podcast'
  })
  @ApiParam({ name: 'podcastId', description: 'Podcast ID' })
  @ApiResponse({
    status: 200,
    description: 'List of episodes for the podcast',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/EpisodeResponseDto' }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' },
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Podcast not found' })
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
  async getEpisodesByPodcast(
    @Param('podcastId', ParseIntPipe) podcastId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageNum = page && page > 0 ? page : 1;
    const limitNum = limit && limit > 0 ? Math.min(limit, 100) : 10;

    return this.episodeService.getEpisodesByPodcast(podcastId, pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific episode by ID' })
  @ApiParam({ name: 'id', description: 'Episode ID' })
  @ApiResponse({
    status: 200,
    description: 'Episode details',
    type: EpisodeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Episode not found' })
  async getEpisodeById(@Param('id', ParseIntPipe) id: number) {
    return this.episodeService.getEpisodeById(id);
  }

}