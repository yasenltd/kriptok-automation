import { get, put } from '@/services';
import { IUser, UpdateUserDto } from '@/types';

export const getUser = async () => get<IUser>(`/users/me`);

export const updateUserMe = (data: UpdateUserDto) =>
  put<boolean>(`/users/me/update`, {
    body: data,
  });
