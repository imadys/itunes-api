import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PodcastService } from './podcast.service';

@ApiTags('episodes')
@Controller('episodes')
export class EpisodeController {
  constructor(private readonly podcastService: PodcastService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific episode by ID' })
  @ApiParam({ name: 'id', description: 'Episode ID' })
  @ApiResponse({
    status: 200,
    description: 'Episode details with podcast information',
  })
  @ApiResponse({ status: 404, description: 'Episode not found' })
  async getEpisodeById(@Param('id', ParseIntPipe) id: number) {
    return this.podcastService.getEpisodeById(id);
  }
}
