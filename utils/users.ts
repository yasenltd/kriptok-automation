import { get, put } from '@/services';
import { IUser } from '@/types';

export const getUser = async () => get<IUser>(`/users/me`);

export const updateHasBackedUp = () => put<boolean>(`/users/me/updateHasBackedUp`);
