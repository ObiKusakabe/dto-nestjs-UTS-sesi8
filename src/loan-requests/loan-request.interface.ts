export enum LoanRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RETURNED = 'RETURNED',
}

export interface LoanRequest {
  id: number;
  borrowerNim: string;
  borrowerName: string;
  borrowerEmail: string;
  assetCode: string;
  quantity: number;
  startDate: string;
  returnDate: string;
  purpose: string;
  status: LoanRequestStatus;
  createdAt: string;
}
