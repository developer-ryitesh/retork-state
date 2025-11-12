import { createStore, useSelector, type ActionType, type Middleware } from "@retork/state";
import productSlice from "./product/product.slice";

const Logger: Middleware = (_) => (next) => (action: ActionType<any>) => {
   if (action.type.includes("/fulfilled")) {
      console.log("Dispatch : " + action.type);
   }
   if (action.type.includes("/rejected")) {
      console.log("Dispatch : " + action.type);
   }
   return next(action);
};

const store = createStore({
   reducers: {
      product: productSlice.reducer,
   },
   middlewares: [Logger],
});

export type RootState = typeof store.initialState;
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);

export default store;
