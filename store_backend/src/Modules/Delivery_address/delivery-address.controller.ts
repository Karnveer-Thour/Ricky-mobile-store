import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DeliveryAddressService } from './delivery-address.service';
import { CreateDeliveryAddressDto } from './Dtos/create-delivery-address.dto';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { UpdateDeliveryAddressDto } from './Dtos/update-delivery-address.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('delivery-address')
@Controller('delivery-address')
export class DeliveryAddressController {
  constructor(private readonly deliveryAddressService: DeliveryAddressService) {}

  @Post()
  async create(@Body() deliveryAddressData:CreateDeliveryAddressDto):Promise<baseResponseDto>{
    return this.deliveryAddressService.create(deliveryAddressData);
  }

  @Patch('id')
  async update(@Param('id') id:string,@Body() deliveryAddressData:UpdateDeliveryAddressDto):Promise<baseResponseDto>{
    return this.deliveryAddressService.update(id,deliveryAddressData);
  }

  @Patch('id/status')
  async toggleStatus(@Param('id') id:string,@Param('status') status:boolean):Promise<baseResponseDto>{
    return this.deliveryAddressService.toggleAddressStatus(id,status);
  }

  @Get('page/limit')
  async getAll(@Param('page') page:string,@Param('limit') limit:string):Promise<baseResponseDto>{
    const pageNumber=parseInt(page||"1");
    const limitNumber=parseInt(limit||"10");
    return this.deliveryAddressService.getAll(pageNumber,limitNumber);
  }

  @Get('id')
  async getById(@Param('id') id:string){
    return this.deliveryAddressService.getById(id);
  }

  @Delete('id')
  async softDeleteById(@Param() id:string){
    return this.deliveryAddressService.softDeleteById(id);
  }

}
