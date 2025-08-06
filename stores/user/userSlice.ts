import { IUser } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  data: IUser | null;
}

const initialState: UserState = {
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.data = action.payload;
    },
    removeUser: state => {
      state.data = null;
    },
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
  },
});

export const { setUser, removeUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
