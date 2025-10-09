export interface BankListResponseDto {
  name: string;
  bank_code: string;
  districts: BankDistrictInfo[];
}
export interface BankDistrictInfo {
  district_name: string;
  branches: BranchInfo[];
}
export interface BranchInfo {
  routing_number: string;
  swiftCode: string;
  branch_name: string;
}
