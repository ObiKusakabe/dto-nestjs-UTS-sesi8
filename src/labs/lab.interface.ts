export enum LabStatus {
  ACTIVE = 'ACTIVE',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  CLOSED = 'CLOSED',
}

export interface Lab {
  id: number;
  labCode: string;
  name: string;
  building: string;
  capacity: number;
  picName: string;
  status: LabStatus;
}
