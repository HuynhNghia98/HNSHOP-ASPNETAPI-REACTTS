import { configureStore } from "@reduxjs/toolkit";
import { userAuthReducer } from "./userAuthSlice";
import { cartReducer } from "./cartSlice";

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    cartStore: cartReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
