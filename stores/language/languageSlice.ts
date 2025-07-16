import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LanguageType } from '@/types';

interface LanguageState {
  language: LanguageType;
  hasBeenSet: boolean;
}

const initialState: LanguageState = {
  language: 'en',
  hasBeenSet: false,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<Partial<LanguageState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setState } = languageSlice.actions;
export default languageSlice.reducer;
