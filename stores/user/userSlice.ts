import { User } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  data: User | null;
}

const initialState: UserState = {
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
    removeUser: state => {
      state.data = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
