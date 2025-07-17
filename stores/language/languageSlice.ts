import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LanguageType } from '@/types';

interface LanguageState {
  language: LanguageType;
}

const initialState: LanguageState = {
  language: 'en',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LanguageType>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
