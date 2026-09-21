import { User as SharedUser, CreateUser as SharedCreateUser, UpdateUser as SharedUpdateUser } from '@uumiees/types';

export interface User extends SharedUser {
  password_hash: string;
}

export type CreateUser = SharedCreateUser;
export type UpdateUser = SharedUpdateUser;
export type UserResponse = Omit<User, 'password_hash'>;