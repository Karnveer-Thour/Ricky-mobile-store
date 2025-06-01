import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "@/store/slices/alert.slice";
export const store = configureStore({
  reducer: {
    Alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
