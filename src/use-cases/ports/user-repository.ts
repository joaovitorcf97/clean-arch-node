import { UserData } from './user-data';

export interface UserRepository {
  findAdd(): Promise<UserData[]>;
  findByEmail(email: string): Promise<UserData>;
  add(userData: UserData): Promise<UserData>;
}
