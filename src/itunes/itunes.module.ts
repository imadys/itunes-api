import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ItunesService } from './itunes.service';

@Module({
  imports: [HttpModule],
  providers: [ItunesService],
  exports: [ItunesService],
})
export class ItunesModule {}
