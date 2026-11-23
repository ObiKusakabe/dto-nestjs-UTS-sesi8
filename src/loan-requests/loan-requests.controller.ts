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
import { CreateLoanRequestDto } from './dto/create-loan-request.dto';
import { FindLoanRequestQueryDto } from './dto/find-loan-request-query.dto';
import { UpdateLoanRequestDto } from './dto/update-loan-request.dto';
import { LoanRequest } from './loan-request.interface';
import { LoanRequestsService } from './loan-requests.service';

@Controller('loan-requests')
export class LoanRequestsController {
  constructor(private readonly loanRequestsService: LoanRequestsService) {}

  @Get()
  findAll(@Query() query: FindLoanRequestQueryDto): LoanRequest[] {
    return this.loanRequestsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): LoanRequest {
    return this.loanRequestsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateLoanRequestDto): LoanRequest {
    return this.loanRequestsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLoanRequestDto,
  ): LoanRequest {
    return this.loanRequestsService.update(id, dto);
  }
}
