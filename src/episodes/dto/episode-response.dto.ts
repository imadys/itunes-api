import { ApiProperty } from '@nestjs/swagger';
import { PodcastResponseDto } from '../../podcasts/dto/podcast-response.dto';

export class EpisodeResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ nullable: true })
  trackId?: number;

  @ApiProperty()
  podcastId: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  audioUrl?: string;

  @ApiProperty({ nullable: true })
  duration?: string;

  @ApiProperty()
  pubDate: Date;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty({ nullable: true })
  shortDescription?: string;

  @ApiProperty({ nullable: true })
  episodeNumber?: number;

  @ApiProperty({ nullable: true })
  episodeType?: string;

  @ApiProperty({ nullable: true })
  image?: string;

  @ApiProperty()
  isFavorite: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: PodcastResponseDto, nullable: true })
  podcast?: PodcastResponseDto;
}