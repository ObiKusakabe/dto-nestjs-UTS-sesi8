export enum MaintenanceSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum MaintenanceStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

export interface MaintenanceLog {
  id: number;
  assetCode: string;
  reportedBy: string;
  issueDescription: string;
  severity: MaintenanceSeverity;
  status: MaintenanceStatus;
  scheduledDate: string;
  createdAt: string;
}
