import { alert, alertType } from "@/types/alert.index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: alert = {
  type: null,
  message: null,
  id: null,
};

export const Alertslice = createSlice({
  name: "Alert",
  initialState,
  reducers: {
    SUCCESSALERT: (state: alert, action: PayloadAction<string>) => {
      state.type = alertType.success;
      state.message = action.payload;
      state.id = Date.now();
    },
    ERRORALERT: (state: alert, action: PayloadAction<string>) => {
      state.type = alertType.error;
      state.message = action.payload;
      state.id = Date.now();
    },
    CLOSEALERT: (state: alert) => {
      state.type = null;
      state.message = null;
      state.id = null;
    },
  },
});

export const { SUCCESSALERT, ERRORALERT, CLOSEALERT } = Alertslice.actions;

export default Alertslice.reducer;
