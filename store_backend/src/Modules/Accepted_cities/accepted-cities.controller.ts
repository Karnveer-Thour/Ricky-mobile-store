import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AcceptedCitiesService } from './accepted-cities.service';
import { AcceptedCitiesDto } from './Dtos/accepted-cities.dto';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { UpdateAcceptedCitiesDto } from './Dtos/update-accepted-cities.dto';
import { AcceptedCitiesPaginationQueryDto } from './Dtos/accepted-cities-pagination-query.dto';

@Controller('accepted-cities')
@Controller('accepted-cities')
export class AcceptedCitiesController {
  constructor(private readonly acceptedCitiesService: AcceptedCitiesService) {}

  @Post('create')
  async create(@Body() cityData: AcceptedCitiesDto): Promise<baseResponseDto> {
    return this.acceptedCitiesService.create(cityData);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() cityData: UpdateAcceptedCitiesDto,
  ): Promise<baseResponseDto> {
    return this.acceptedCitiesService.update(id, cityData);
  }

  @Patch('toggle/status/:id/:status')
  async toggleStatus(
    @Param('id') id: string,
    @Param('status') isAccepting: boolean,
  ): Promise<baseResponseDto> {
    return this.acceptedCitiesService.toggleStatus(id, isAccepting);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.acceptedCitiesService.getById(id);
  }

  @Get()
  async getAll(@Query() query: AcceptedCitiesPaginationQueryDto): Promise<baseResponseDto> {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const searchText = query.searchText || null;

    return this.acceptedCitiesService.getAll(page, limit, searchText);
  }

  @Delete(':id')
  async softDeleteById(@Param('id') id: string): Promise<baseResponseDto> {
    return this.acceptedCitiesService.softDeleteById(id);
  }
}
