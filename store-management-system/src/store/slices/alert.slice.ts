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
    SUCCESSALERT: (state, action) => {
      (state.type = alertType.success),
        (state.message = action.payload),
        (state.id = Date.now());
    },
    ERRORALERT: (state, action) => {
      (state.type = alertType.error), (state.message = action.payload);
    },
    CLOSEALERT: (state, action) => {
      (state.type = null), (state.message = null);
    },
  },
});

export const { SUCCESSALERT, ERRORALERT, CLOSEALERT } = Alertslice.actions;

export default Alertslice.reducer;
