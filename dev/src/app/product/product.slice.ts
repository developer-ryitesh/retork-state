import { asyncThunk, createSlice, type ActionType } from "@retork/state";
import axios from "axios";

const initialState = {
   fetchProducts: {
      data: [] as any[],
      isLoading: true,
   },
   cart: {
      quantity: 0,
   },
};

//sync reducer
const cartReducer = (state: typeof initialState, action: any) => {
   if (action.type === "increment") {
      state.cart.quantity += 1;
   }
   if (action.type === "decrement") {
      state.cart.quantity -= 1;
   }
};

//async reducer
const fetchProductsApi = {
   api: asyncThunk("fetchProducts", async (_) => {
      const { data } = await axios.get("https://api.escuelajs.co/api/v1/products");
      return data;
   }),
   reducer(state: typeof initialState, action: ActionType<any>) {
      if (action.type === this.api.pending) {
         state.fetchProducts.isLoading = true;
      }
      if (action.type === this.api.fulfilled) {
         state.fetchProducts.isLoading = false;
         state.fetchProducts.data = action.payload;
      }
      if (action.type === this.api.rejected) {
         state.fetchProducts.isLoading = false;
         state.fetchProducts.data = [];
      }
   },
};

const productSlice = createSlice({
   name: "product",
   initialState: initialState,
   reducer: (...params) => {
      cartReducer(...params);
      fetchProductsApi.reducer(...params);
   },
});

export { fetchProductsApi };
export default productSlice;
