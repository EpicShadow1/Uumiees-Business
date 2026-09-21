export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUser {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}