export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  password?: string;
  is_superuser: boolean;
  is_active: boolean;
}

export const UserSerializer = {
  read: (u: string): User => (u ? JSON.parse(u) : undefined),
  write: (u: User): string => JSON.stringify(u),
};
