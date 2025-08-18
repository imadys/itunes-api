import { ApiProperty } from '@nestjs/swagger';

export class PodcastResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  trackId: number;

  @ApiProperty()
  trackName: string;

  @ApiProperty()
  artistName: string;

  @ApiProperty({ required: false })
  collectionName?: string;

  @ApiProperty()
  trackViewUrl: string;

  @ApiProperty({ required: false })
  artworkUrl30?: string;

  @ApiProperty({ required: false })
  artworkUrl60?: string;

  @ApiProperty({ required: false })
  artworkUrl100?: string;

  @ApiProperty({ required: false })
  collectionPrice?: number;

  @ApiProperty({ required: false })
  trackPrice?: number;

  @ApiProperty({ required: false })
  releaseDate?: Date;

  @ApiProperty({ required: false })
  collectionExplicitness?: string;

  @ApiProperty({ required: false })
  trackExplicitness?: string;

  @ApiProperty({ required: false })
  trackCount?: number;

  @ApiProperty()
  country: string;

  @ApiProperty({ required: false })
  currency?: string;

  @ApiProperty({ required: false })
  primaryGenreName?: string;

  @ApiProperty({ required: false })
  contentAdvisoryRating?: string;

  @ApiProperty({ required: false })
  feedUrl?: string;

  @ApiProperty({ type: [String] })
  genres: string[];

  @ApiProperty()
  searchKeyword: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
