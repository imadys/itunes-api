import { ApiProperty } from '@nestjs/swagger';

export class EpisodeResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  enclosureUrl?: string;

  @ApiProperty({ required: false })
  enclosureType?: string;

  @ApiProperty({ required: false })
  enclosureLength?: number;

  @ApiProperty({ required: false })
  pubDate?: Date;

  @ApiProperty({ required: false })
  duration?: string;

  @ApiProperty({ required: false, default: false })
  explicit?: boolean;

  @ApiProperty({ required: false })
  episodeNumber?: number;

  @ApiProperty({ required: false })
  seasonNumber?: number;

  @ApiProperty({ required: false })
  episodeType?: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty()
  podcastId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}