import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DeliveryAddressService } from './delivery-address.service';
import { CreateDeliveryAddressDto } from './Dtos/create-delivery-address.dto';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { UpdateDeliveryAddressDto } from './Dtos/update-delivery-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { DeliveryAddressPaginationQueryDto } from './Dtos/delivery-address-pagination-query.dto';

@ApiTags('delivery-address')
@Controller('delivery-address')
export class DeliveryAddressController {
  constructor(private readonly deliveryAddressService: DeliveryAddressService) {}

  @Post()
  async create(@Body() deliveryAddressData:CreateDeliveryAddressDto):Promise<baseResponseDto>{
    return this.deliveryAddressService.create(deliveryAddressData);
  }

  @Patch(':id')
  async update(@Param('id') id:string,@Body() deliveryAddressData:UpdateDeliveryAddressDto):Promise<baseResponseDto>{
    return this.deliveryAddressService.update(id,deliveryAddressData);
  }

  @Patch(':id/:status')
  async toggleStatus(@Param('id') id:string,@Param('status') status:boolean):Promise<baseResponseDto>{
    return this.deliveryAddressService.toggleAddressStatus(id,status);
  }

  @Get()
  async getAll(@Query() query:DeliveryAddressPaginationQueryDto):Promise<baseResponseDto>{
    const pageNumber=parseInt(query.page||"1");
    const limitNumber=parseInt(query.limit||"10");
    return this.deliveryAddressService.getAll(pageNumber,limitNumber);
  }

  @Get(':id')
  async getById(@Param('id') id:string){
    return this.deliveryAddressService.getById(id);
  }

  @Delete(':id')
  async softDeleteById(@Param('id') id:string){
    console.log(id);
    return this.deliveryAddressService.softDeleteById(id);
  }

}
