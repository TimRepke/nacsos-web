export interface User {
  user_id?: string;
  username: string;
  full_name: string;
  affiliation: string;
  email: string;
  password?: string;
  is_superuser: boolean;
  is_active: boolean;
}
