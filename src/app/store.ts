import { configureStore } from "@reduxjs/toolkit";
import AuthAPI from "../services/auth.service";
import authReducer from "./slices/auth.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [AuthAPI.reducerPath]: AuthAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(AuthAPI.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
