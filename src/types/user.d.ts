export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  password?: string;
  is_superuser: boolean;
  is_active: boolean;
}
