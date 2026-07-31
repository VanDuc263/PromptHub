import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { authReducer } from "@/store/auth-slice";
import { exploreReducer } from "@/store/explore-slice";

export const store = configureStore({
  reducer: { auth: authReducer, explore: exploreReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
