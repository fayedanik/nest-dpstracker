export interface DpsResponseDto {
  id: string;
  dpsName: string;
  accountNo: string;
  monthlyAmount: number;
  durationMonths: number;
  startDate: Date | string;
  maturityDate: Date | string;
  interestRate: number;
  totalDeposit: number;
  installmentDates: Date[];
  dpsOwners: {
    userId: string;
    displayName: string;
    amountPaid: number;
    installmentDates: Date[];
  }[];
  canUpdate: boolean;
  canDelete: boolean;
}
