export interface TransactionResponseDto {
  id: string;
  sourceAc: string;
  senderUserId: string;
  senderDisplayName: string;
  destAc: string;
  amount: number;
  note: string;
  paymentType: string;
  transactionType: string;
  dpsId: string;
  transactionNo: string;
  transactionDate: Date | string;
  status: string;
}
