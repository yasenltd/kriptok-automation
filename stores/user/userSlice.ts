import { IUser, Token } from '@/types';
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
    updateTokens: (
      state,
      action: PayloadAction<{
        sol?: Array<Token>;
        eth?: Array<Token>;
        btc?: Array<Token>;
        sui?: Array<Token>;
        polygon?: Array<Token>;
        bnb?: Array<Token>;
      }>,
    ) => {
      if (state.data) {
        if (!state.data.tokens) {
          state.data.tokens = { sol: [], eth: [], btc: [], sui: [], polygon: [], bnb: [] };
        }
        state.data.tokens = { ...state.data.tokens, ...action.payload };
      }
    },
  },
});

export const { setUser, removeUser, updateUser, updateTokens } = userSlice.actions;
export default userSlice.reducer;
