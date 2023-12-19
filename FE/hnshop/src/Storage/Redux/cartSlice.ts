import { createSlice } from "@reduxjs/toolkit";
import CartModel from "../../Services/Interfaces/CartModel";

export const emptyCartState: CartModel = {
  count: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: emptyCartState,
  reducers: {
    setCart: (state, action) => {
      state.count = action.payload.count;
    },
  },
});

export const { setCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
