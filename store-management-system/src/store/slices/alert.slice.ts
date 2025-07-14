import { alert, alertType } from "@/types/alert.index";
import { createSlice } from "@reduxjs/toolkit";

const initialState: alert = {
  type: null,
  message: null,
  id: null,
};

export const Alertslice = createSlice({
  name: "Alert",
  initialState,
  reducers: {
    SUCCESSALERT: (state:any, action:any) => {
      (state.type = alertType.success),
        (state.message = action.payload),
        (state.id = Date.now());
    },
    ERRORALERT: (state:any, action:any) => {
      (state.type = alertType.error),
        (state.message = action.payload),
        (state.id = Date.now());
    },
    CLOSEALERT: (state:any, action:any) => {
      (state.type = null), (state.message = null);
    },
  },
});

export const { SUCCESSALERT, ERRORALERT, CLOSEALERT } = Alertslice.actions;

export default Alertslice.reducer;
