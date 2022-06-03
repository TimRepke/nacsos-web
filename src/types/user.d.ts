export interface User {
  user_id?: number;
  username: string;
  full_name: string;
  affiliation: string;
  email: string;
  password?: string;
  is_superuser: boolean;
  is_active: boolean;
}
