import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoanRequestDto } from './dto/create-loan-request.dto';
import { FindLoanRequestQueryDto } from './dto/find-loan-request-query.dto';
import { UpdateLoanRequestDto } from './dto/update-loan-request.dto';
import {
  LoanRequest,
  LoanRequestStatus,
} from './loan-request.interface';

@Injectable()
export class LoanRequestsService {
  private loanRequests: LoanRequest[] = [
    {
      id: 1,
      borrowerNim: '240414001',
      borrowerName: 'Ahmad Fauzi',
      borrowerEmail: 'ahmad.fauzi@example.com',
      assetCode: 'LAB-EL-001',
      quantity: 1,
      startDate: '2026-11-20',
      returnDate: '2026-11-25',
      purpose: 'Praktikum mata kuliah elektronika dasar modul osiloskop',
      status: LoanRequestStatus.PENDING,
      createdAt: '2026-11-19T08:00:00.000Z',
    },
    {
      id: 2,
      borrowerNim: '240414015',
      borrowerName: 'Roby Rachmat Firdaus',
      borrowerEmail: 'roby.firdaus@example.com',
      assetCode: 'LAB-NW-001',
      quantity: 2,
      startDate: '2026-11-22',
      returnDate: '2026-11-26',
      purpose: 'Simulasi konfigurasi routing OSPF untuk tugas akhir jaringan',
      status: LoanRequestStatus.PENDING,
      createdAt: '2026-11-21T09:30:00.000Z',
    },
    {
      id: 3,
      borrowerNim: '240414022',
      borrowerName: 'Siti Nurhaliza',
      borrowerEmail: 'siti.nurhaliza@example.com',
      assetCode: 'LAB-MM-001',
      quantity: 1,
      startDate: '2026-11-24',
      returnDate: '2026-11-27',
      purpose: 'Perekaman video dokumentasi pameran karya multimedia',
      status: LoanRequestStatus.PENDING,
      createdAt: '2026-11-23T07:15:00.000Z',
    },
  ];

  findAll(query?: FindLoanRequestQueryDto): LoanRequest[] {
    let result = [...this.loanRequests];

    if (query?.status) {
      result = result.filter((item) => item.status === query.status);
    }

    if (query?.borrowerNim) {
      result = result.filter((item) => item.borrowerNim === query.borrowerNim);
    }

    if (query?.page || query?.limit) {
      const page = query.page ? Number(query.page) : 1;
      const limit = query.limit ? Number(query.limit) : 10;
      const startIndex = (page - 1) * limit;
      return result.slice(startIndex, startIndex + limit);
    }

    return result;
  }

  findOne(id: number): LoanRequest {
    const loanRequest = this.loanRequests.find((item) => item.id === id);
    if (!loanRequest) {
      throw new NotFoundException('Loan request not found');
    }
    return loanRequest;
  }

  create(dto: CreateLoanRequestDto): LoanRequest {
    const nextId = this.loanRequests.length
      ? Math.max(...this.loanRequests.map((item) => item.id)) + 1
      : 1;

    const newLoanRequest: LoanRequest = {
      id: nextId,
      ...dto,
      status: LoanRequestStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    this.loanRequests.push(newLoanRequest);
    return newLoanRequest;
  }

  update(id: number, dto: UpdateLoanRequestDto): LoanRequest {
    const loanRequest = this.findOne(id);

    if (dto.returnDate !== undefined) {
      loanRequest.returnDate = dto.returnDate;
    }
    if (dto.purpose !== undefined) {
      loanRequest.purpose = dto.purpose;
    }

    return loanRequest;
  }
}
