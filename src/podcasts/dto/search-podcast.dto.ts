import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchPodcastDto {
  @ApiProperty({
    description: 'Search keyword for podcasts',
    example: 'فنجان',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  keyword: string;
}
