import {
  IsEnum,
  IsInt,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { EquipmentCategory, EquipmentCondition } from '../equipment.interface';

export class CreateEquipmentDto {
  @IsString()
  @Matches(/^LAB-[A-Z]{2}-[0-9]{3}$/, {
    message: 'assetCode must match format LAB-XX-000 (e.g., LAB-EL-001)',
  })
  assetCode: string;

  @IsString()
  @Length(3, 80)
  name: string;

  @IsEnum(EquipmentCategory)
  category: EquipmentCategory;

  @IsEnum(EquipmentCondition)
  condition: EquipmentCondition;

  @IsInt()
  @Min(0)
  @Max(50)
  stock: number;

  @IsString()
  @Length(2, 60)
  location: string;
}
