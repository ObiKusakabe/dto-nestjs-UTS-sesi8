import { Injectable, NotFoundException } from '@nestjs/common';
import {
  MaintenanceLog,
  MaintenanceSeverity,
  MaintenanceStatus,
} from './maintenance-log.interface';
import { CreateMaintenanceLogDto } from './dto/create-maintenance-log.dto';
import { UpdateMaintenanceLogDto } from './dto/update-maintenance-log.dto';
import { FindMaintenanceLogQueryDto } from './dto/find-maintenance-log-query.dto';

@Injectable()
export class MaintenanceLogsService {
  private readonly maintenanceLogs: MaintenanceLog[] = [
    {
      id: 1,
      assetCode: 'LAB-MM-001',
      reportedBy: 'Ahmad Fauzi',
      issueDescription:
        'Lampu proyektor berkedip dan redup setelah pemakaian 15 menit',
      severity: MaintenanceSeverity.MEDIUM,
      status: MaintenanceStatus.OPEN,
      scheduledDate: '2026-11-25',
      createdAt: '2026-11-20T08:30:00.000Z',
    },
    {
      id: 2,
      assetCode: 'LAB-OT-001',
      reportedBy: 'Budi Santoso',
      issueDescription:
        'Mata obeng minus ukuran 2mm patah dan kotak penyimpanan rusak',
      severity: MaintenanceSeverity.LOW,
      status: MaintenanceStatus.IN_PROGRESS,
      scheduledDate: '2026-11-24',
      createdAt: '2026-11-21T09:15:00.000Z',
    },
    {
      id: 3,
      assetCode: 'LAB-MM-001',
      reportedBy: 'Citra Dewi',
      issueDescription: 'Kipas pendingin proyektor berbunyi keras dan overheat',
      severity: MaintenanceSeverity.HIGH,
      status: MaintenanceStatus.RESOLVED,
      scheduledDate: '2026-11-18',
      createdAt: '2026-11-15T10:00:00.000Z',
    },
  ];

  findAll(query?: FindMaintenanceLogQueryDto): MaintenanceLog[] {
    let result = [...this.maintenanceLogs];

    if (query?.status) {
      result = result.filter((log) => log.status === query.status);
    }

    if (query?.severity) {
      result = result.filter((log) => log.severity === query.severity);
    }

    if (query?.assetCode) {
      const code = query.assetCode.toLowerCase();
      result = result.filter((log) =>
        log.assetCode.toLowerCase().includes(code),
      );
    }

    if (query?.page || query?.limit) {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const startIndex = (page - 1) * limit;
      result = result.slice(startIndex, startIndex + limit);
    }

    return result;
  }

  findOne(id: number): MaintenanceLog {
    const log = this.maintenanceLogs.find((item) => item.id === id);
    if (!log) {
      throw new NotFoundException('Maintenance log not found');
    }
    return log;
  }

  create(dto: CreateMaintenanceLogDto): MaintenanceLog {
    const nextId = this.maintenanceLogs.length
      ? Math.max(...this.maintenanceLogs.map((item) => item.id)) + 1
      : 1;

    const newLog: MaintenanceLog = {
      id: nextId,
      assetCode: dto.assetCode,
      reportedBy: dto.reportedBy,
      issueDescription: dto.issueDescription,
      severity: dto.severity,
      status: MaintenanceStatus.OPEN,
      scheduledDate: dto.scheduledDate,
      createdAt: new Date().toISOString(),
    };

    this.maintenanceLogs.push(newLog);
    return newLog;
  }

  update(id: number, dto: UpdateMaintenanceLogDto): MaintenanceLog {
    const log = this.findOne(id);
    Object.assign(log, dto);
    return log;
  }

  resolve(id: number): MaintenanceLog {
    const log = this.findOne(id);
    log.status = MaintenanceStatus.RESOLVED;
    return log;
  }
}
