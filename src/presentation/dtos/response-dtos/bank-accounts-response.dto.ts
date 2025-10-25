export interface BankAccountsResponseDto {
  id: string;
  accountNo: string;
  bankName: string;
  bankId: string;
  branchName: string;
  branchId: string;
  accountType: string;
  accountHolders: {
    userId: string;
    displayName: string;
  }[];
}
