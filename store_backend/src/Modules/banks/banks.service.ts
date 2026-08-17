import { Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { ENV_CONFIG } from 'Common/constants';

@Injectable()
export class BanksService {
  private readonly logger = new Logger(BanksService.name);

  private maskMobile(mobile: string): string {
    if (!mobile || mobile.length < 4) return '***';
    return `******${mobile.slice(-4)}`;
  }

  async checkBajajEligibility(mobile: string, otp: string, amount: number) {
    const masked = this.maskMobile(mobile);
    this.logger.log(`Checking Bajaj Finserv eligibility for mobile: ${masked}, amount: ₹${amount}`);

    const apiSecret = ENV_CONFIG.BANKS.BAJAJ_API_SECRET;

    // Simulate standard eligibility logic with 8s timeout guard
    return Promise.race([
      new Promise((resolve) => {
        setTimeout(() => {
          const approved = amount <= 150000 && otp === '1234';
          const limit = approved ? 150000 : 0;
          resolve({
            approved,
            limit,
            tenure_options: [3, 6, 9, 12],
          });
        }, 1000); // normal response in 1s
      }),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new RequestTimeoutException('Bajaj Finserv gateway timeout.'));
        }, 8000); // 8s hard limit
      }),
    ]);
  }

  async checkHomeCreditEligibility(mobile: string, otp: string, amount: number) {
    const masked = this.maskMobile(mobile);
    this.logger.log(`Checking Home Credit eligibility for mobile: ${masked}, amount: ₹${amount}`);

    const apiSecret = ENV_CONFIG.BANKS.HOMECREDIT_API_SECRET;

    return Promise.race([
      new Promise((resolve) => {
        setTimeout(() => {
          const approved = amount <= 120000 && otp === '1234';
          const limit = approved ? 120000 : 0;
          resolve({
            approved,
            limit,
            tenure_options: [3, 6, 9, 12],
          });
        }, 1200);
      }),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new RequestTimeoutException('Home Credit gateway timeout.'));
        }, 8000);
      }),
    ]);
  }
}
