import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class UpdateLoanRequestDto {
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @IsString()
  @Length(15, 250)
  purpose?: string;
}
