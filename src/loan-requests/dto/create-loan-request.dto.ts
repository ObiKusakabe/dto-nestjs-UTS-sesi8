import {
  IsDateString,
  IsEmail,
  IsInt,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { IsAfterOrEqualDate } from '../../common/validators/is-after-or-equal-date.validator';

export class CreateLoanRequestDto {
  @IsString()
  @Matches(/^[0-9]{8,12}$/, {
    message: 'borrowerNim must be a numeric string between 8 and 12 digits',
  })
  borrowerNim: string;

  @IsString()
  @Length(3, 70)
  borrowerName: string;

  @IsEmail()
  borrowerEmail: string;

  @IsString()
  @Matches(/^LAB-[A-Z]{2}-[0-9]{3}$/, {
    message: 'assetCode must match format LAB-XX-000 (e.g., LAB-EL-001)',
  })
  assetCode: string;

  @IsInt()
  @Min(1)
  @Max(3)
  quantity: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsAfterOrEqualDate('startDate', {
    message: 'returnDate must be equal to or after startDate',
  })
  returnDate: string;

  @IsString()
  @Length(15, 250)
  purpose: string;
}
