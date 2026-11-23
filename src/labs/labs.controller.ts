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
import { LabsService } from './labs.service';
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';
import { FindLabQueryDto } from './dto/find-lab-query.dto';
import { Lab } from './lab.interface';

@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Get()
  findAll(@Query() query: FindLabQueryDto): Lab[] {
    return this.labsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Lab {
    return this.labsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateLabDto): Lab {
    return this.labsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLabDto,
  ): Lab {
    return this.labsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Lab {
    return this.labsService.remove(id);
  }
}
