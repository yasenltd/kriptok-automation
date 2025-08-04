import { get, put } from '@/services';
import { UpdateUserDto, User } from '@/types';

export const getUser = () => get<User>(`/users/me`);

export const updateUserMe = (data: UpdateUserDto) =>
  put<boolean>(`/users/me/update`, {
    body: data,
  });
