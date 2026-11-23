import { Module } from '@nestjs/common';
import { LoanRequestsController } from './loan-requests.controller';
import { LoanRequestsService } from './loan-requests.service';

@Module({
  controllers: [LoanRequestsController],
  providers: [LoanRequestsService],
  exports: [LoanRequestsService],
})
export class LoanRequestsModule {}
