import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { FindEquipmentQueryDto } from './dto/find-equipment-query.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './equipment.interface';
import { EquipmentService } from './equipment.service';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  findAll(@Query() query: FindEquipmentQueryDto): Equipment[] {
    return this.equipmentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Equipment {
    return this.equipmentService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateEquipmentDto): Equipment {
    return this.equipmentService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEquipmentDto,
  ): Equipment {
    return this.equipmentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Equipment {
    return this.equipmentService.remove(id);
  }
}
