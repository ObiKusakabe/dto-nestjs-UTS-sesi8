import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { EquipmentCategory, EquipmentCondition } from '../equipment.interface';

export class UpdateEquipmentDto {
  @IsOptional()
  @IsString()
  @Matches(/^LAB-[A-Z]{2}-[0-9]{3}$/, {
    message: 'assetCode must match format LAB-XX-000 (e.g., LAB-EL-001)',
  })
  assetCode?: string;

  @IsOptional()
  @IsString()
  @Length(3, 80)
  name?: string;

  @IsOptional()
  @IsEnum(EquipmentCategory)
  category?: EquipmentCategory;

  @IsOptional()
  @IsEnum(EquipmentCondition)
  condition?: EquipmentCondition;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  stock?: number;

  @IsOptional()
  @IsString()
  @Length(2, 60)
  location?: string;
}
