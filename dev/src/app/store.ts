import { createStore, useSelector } from "@retork/state";
import productSlice from "./product/product.slice";

const store = createStore({
   reducers: {
      product: productSlice.reducer,
   },
   middlewares: [],
});

type RootState = typeof store.initialState;
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);

export default store;
