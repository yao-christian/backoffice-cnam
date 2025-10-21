export type AuthSession = {
  user: User;
  role: Role;
  perm: Permissions;
};

export type User = {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  status: number;
  phone: string;
};

export type Role = {
  uuid: string;
  name: string;
  description: string;
};

export type Permissions = {
  [key: string]: boolean;
};

export type UserResponse = {
  status: string;
  message: string;
  data: AuthSession;
};
