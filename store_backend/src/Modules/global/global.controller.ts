import { Controller, Get, Query } from '@nestjs/common';
import { GlobalService } from './global.service';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { ApiTags } from '@nestjs/swagger';
import { GlobalQueryDto } from './Dtos/global-query.dto';

@ApiTags('Global Search')
@Controller('global')
export class GlobalController {
  constructor(private readonly globalService: GlobalService) {}

  @Get('search/:query')
  async globalSearch(@Query() query:GlobalQueryDto): Promise<baseResponseDto> {
    return this.globalService.globalSearch(query.query);
  }
}
