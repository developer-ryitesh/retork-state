# @retork/state

<p align="center">
  <img src="https://raw.githubusercontent.com/developer-ryitesh/retork-state/refs/heads/master/dev/public/logo.png" alt="@retork/state logo" width="200" />
</p>

<p align="center">
  <strong>A lightweight, Redux-inspired state management library for React applications.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@retork/state">
    <img src="https://img.shields.io/npm/v/@retork/state.svg" alt="NPM Version" />
  </a>
  <a href="https://github.com/riteshmyhub/@retork/state/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@retork/state.svg" alt="License" />
  </a>
  <a href="https://github.com/riteshmyhub/@retork/state/commits/main">
    <img src="https://img.shields.io/github/last-commit/riteshmyhub/@retork/state.svg" alt="Last Commit" />
  </a>
</p>

`@retork/state` provides a simple and intuitive API for creating and managing application state, with built-in support for asynchronous actions and middleware.

## ✨ Features

-  **Lightweight:** Only 2KB gzipped.
-  **Simple API:** Easy to learn and use.
-  **Redux-inspired:** Familiar concepts for Redux users.
-  **Async Actions:** Built-in support for asynchronous actions with `asyncThunk`.
-  **Middleware:** Extend the store's functionality with custom middleware.
-  **TypeScript Support:** Written in TypeScript for a better developer experience.

## 📦 Installation

```bash
npm install @retork/state
```

## 🚀 Usage

### 1. Create a Slice

A slice is a collection of a reducer function, a name, and an initial state value.

```typescript
// product/product.slice.ts
import { asyncThunk, createSlice, type ActionType, type AsyncReducer } from "@retork/state";

const initialState = {
   fetchProducts: {
      data: [] as any[],
      isLoading: true,
   },
   cart: {
      quantity: 0,
   },
};

// Sync reducer
const cartReducer = (state: typeof initialState, action: any) => {
   if (action.type === "increment") {
      state.cart.quantity += 1;
   }
   if (action.type === "decrement") {
      state.cart.quantity -= 1;
   }
};

// MethodType
const fetchProductsApi = {
   api: asyncThunk("fetchProducts", async (_) => {
      const res = await fetch("https://api.escuelajs.co/api/v1/products");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
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
      fetchProducts.reducer(...params);
   },
});

export { fetchProductsApi };
export default productSlice;
```

### 2. Create Middleware

```typescript
import { type ActionType, type Middleware } from "@retork/state";

const Middleware: Middleware = (_) => (next) => (action: ActionType<any>) => {
   if (action.type.includes("/fulfilled")) {
      console.log("Dispatch : " + action.type);
   }
   if (action.type.includes("/rejected")) {
      console.log("Dispatch : " + action.type);
   }
   return next(action);
};
export { Middleware };
```

### 3. Create a Store

The store brings together your slices and middleware.

```typescript
// app/store.ts
import { createStore, useSelector, type ActionType } from "@retork/state";
import productSlice from "./product/product.slice";

const store = createStore({
   reducers: {
      product: productSlice.reducer,
   },
   middlewares: [Middleware],
});

export type RootState = typeof store.initialState;
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);
export default store;
```

### 4. Provide the Store

Wrap your application with the `StoreProvider` to make the store available to your components.

```typescript
// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { StoreProvider } from "@retork/state";
import store from "./app/store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <StoreProvider store={store}>
      <App />
   </StoreProvider>
);
```

### 5. Use in Components

Use the `useSelector` and `useAppDispatch` hooks to interact with the store in your components.

```typescript
// product/Product.tsx
import { useEffect } from "react";
import { useAppDispatch } from "@retork/state";
import { useAppSelector } from "../store";
import { fetchProductsApi } from "./product.slice";

export default function Product() {
   const { fetchProducts } = useAppSelector((state) => state.product);
   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(fetchProductsApi.api(null));
   }, []);

   if (fetchProducts.isLoading) {
      return "isLoading...";
   }

   return (
      <div>
         {fetchProducts?.data?.map((product, idx) => (
            <div key={idx}>{product?.title}</div>
         ))}
      </div>
   );
}
```

```typescript
// product/Cart.tsx
function Cart() {
   const { cart } = useAppSelector((state) => state.product);
   const dispatch = useAppDispatch();

   return (
      <div>
         <p>Count: {cart.quantity}</p>
         <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
         <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
      </div>
   );
}
```

## 📖 API Reference

| Function                           | Description                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| `createStore(config)`              | Creates a new store.                                                             |
| `createSlice(config)`              | Creates a new slice.                                                             |
| `useSelector(selector)`            | A React hook that allows you to extract data from the store state.               |
| `useAppDispatch()`                 | A React hook that returns the store's `dispatch` function.                       |
| `dispatch.withPromise(action)`     | A utility that allows you to dispatch an action and receive a promise in return. |
| `asyncThunk(type, payloadCreator)` | A utility for creating asynchronous thunks.                                      |

## 🤝 Contributing

Contributions, issues and feature requests are welcome!
Feel free to check [issues page](https://github.com/riteshmyhub/@retork/state/issues).

## 📝 License

Copyright © 2023 [Ritesh Goswami](https://github.com/riteshmyhub).<br />
This project is [ISC](https://github.com/riteshmyhub/@retork/state/blob/main/LICENSE) licensed.
