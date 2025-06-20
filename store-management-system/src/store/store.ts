import { configureStore, combineReducers } from "@reduxjs/toolkit";
import alertReducer from "@/store/slices/alert.slice";
import darkModeReducer from "@/store/slices/isDarkMode.slice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["DarkMode"],
};

const reducer = combineReducers({
  Alert: alertReducer,
  DarkMode: darkModeReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
