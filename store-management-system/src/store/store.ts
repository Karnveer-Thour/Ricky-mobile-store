import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "@/store/slices/alert.slice";
import darkModeReducer from "@/store/slices/isDarkMode.slice";
export const store = configureStore({
  reducer: {
    Alert: alertReducer,
    DarkMode: darkModeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
