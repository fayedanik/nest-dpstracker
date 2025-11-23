export interface DashboardStatsResponseDto {
  accounts: {
    id: string;
    accountNo: string;
    amountShare: number;
  }[];
}
