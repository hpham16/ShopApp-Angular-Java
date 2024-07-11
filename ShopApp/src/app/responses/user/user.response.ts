import { Role } from "../../models/role";
export interface UserResponse {
  id: number | string;
  fullname: string;
  address: string;
  is_active: boolean;
  date_of_birth: Date;
  facebook_account_id: number;
  google_account_id: number;
  avatar: string | null;
  role: Role;
}
