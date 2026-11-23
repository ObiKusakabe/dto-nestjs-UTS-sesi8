import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MaintenanceLogsService } from './maintenance-logs.service';
import { CreateMaintenanceLogDto } from './dto/create-maintenance-log.dto';
import { UpdateMaintenanceLogDto } from './dto/update-maintenance-log.dto';
import { FindMaintenanceLogQueryDto } from './dto/find-maintenance-log-query.dto';
import { MaintenanceLog } from './maintenance-log.interface';

@Controller('maintenance-logs')
export class MaintenanceLogsController {
  constructor(
    private readonly maintenanceLogsService: MaintenanceLogsService,
  ) {}

  @Get()
  findAll(@Query() query: FindMaintenanceLogQueryDto): MaintenanceLog[] {
    return this.maintenanceLogsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): MaintenanceLog {
    return this.maintenanceLogsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateMaintenanceLogDto): MaintenanceLog {
    return this.maintenanceLogsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaintenanceLogDto,
  ): MaintenanceLog {
    return this.maintenanceLogsService.update(id, dto);
  }

  @Patch(':id/resolve')
  resolve(@Param('id', ParseIntPipe) id: number): MaintenanceLog {
    return this.maintenanceLogsService.resolve(id);
  }
}
