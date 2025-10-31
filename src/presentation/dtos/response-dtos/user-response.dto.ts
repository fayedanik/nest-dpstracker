export interface UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
  createdAt?: Date | string | null;
  isActive: boolean;
}
