import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    Query,
    HttpCode,
    HttpStatus,
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
      description: 'Searches iTunes API for podcasts using the provided keyword and stores the results in the database. Example: searching for "فنجان" will find Arabic podcasts.'
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
            items: { $ref: '#/components/schemas/PodcastResponseDto' }
          }
        }
      }
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
    async getAllPodcasts(@Query('keyword') keyword?: string) {
      if (keyword) {
        return this.podcastService.getPodcastsByKeyword(keyword);
      }
      return this.podcastService.getAllPodcasts();
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
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a podcast by ID' })
    @ApiParam({ name: 'id', description: 'Podcast ID' })
    @ApiResponse({ status: 204, description: 'Podcast deleted successfully' })
    @ApiResponse({ status: 404, description: 'Podcast not found' })
    async deletePodcast(@Param('id', ParseIntPipe) id: number) {
      await this.podcastService.deletePodcast(id);
    }
  }
  