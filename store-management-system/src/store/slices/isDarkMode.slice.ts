import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: false,
};

export const isDarkModeSlice = createSlice({
  name: "isDarkMode",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { toggleDarkMode } = isDarkModeSlice.actions;

export default isDarkModeSlice.reducer;
