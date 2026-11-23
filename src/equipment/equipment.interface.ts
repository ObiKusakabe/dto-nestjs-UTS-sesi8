export enum EquipmentCategory {
  ELECTRONIC = 'ELECTRONIC',
  NETWORK = 'NETWORK',
  MULTIMEDIA = 'MULTIMEDIA',
  OTHER = 'OTHER',
}

export enum EquipmentCondition {
  GOOD = 'GOOD',
  MINOR_DAMAGE = 'MINOR_DAMAGE',
  NEEDS_REPAIR = 'NEEDS_REPAIR',
}

export interface Equipment {
  id: number;
  assetCode: string;
  name: string;
  category: EquipmentCategory;
  condition: EquipmentCondition;
  stock: number;
  location: string;
}
