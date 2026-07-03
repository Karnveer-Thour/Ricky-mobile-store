import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { BanksService } from './banks.service';

import { IsString, IsNumber, IsOptional } from 'class-validator';

export class EligibilityDto {
  @IsString()
  mobile: string;

  @IsString()
  @IsOptional()
  otp?: string;

  @IsNumber()
  amount: number;
}

@Controller()
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Post('finserv/check-eligibility')
  @HttpCode(HttpStatus.OK)
  async checkFinserv(@Body() dto: EligibilityDto) {
    return this.banksService.checkBajajEligibility(dto.mobile, dto.otp, dto.amount);
  }

  @Post('homecredit/check-eligibility')
  @HttpCode(HttpStatus.OK)
  async checkHomeCredit(@Body() dto: EligibilityDto) {
    return this.banksService.checkHomeCreditEligibility(dto.mobile, dto.otp, dto.amount);
  }
}
