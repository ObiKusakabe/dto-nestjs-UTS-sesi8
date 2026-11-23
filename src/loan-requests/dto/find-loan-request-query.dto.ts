import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { LoanRequestStatus } from '../loan-request.interface';

export class FindLoanRequestQueryDto {
  @IsOptional()
  @IsEnum(LoanRequestStatus)
  status?: LoanRequestStatus;

  @IsOptional()
  @IsString()
  borrowerNim?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number;
}
