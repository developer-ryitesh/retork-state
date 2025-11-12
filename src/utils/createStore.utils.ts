import type { Middleware } from "middlewares";

type Reducer<S = any, A = any> = (state: S | undefined, action: A) => S;

export function createStore<R extends Record<string, Reducer<any, any>>>(store: { reducers: R; middlewares: Middleware[] }) {
   // --- Root reducer ---
   const rootReducer = (state: any = {}, action: any) => {
      const nextState: any = {};
      for (const key in store.reducers) {
         nextState[key] = store.reducers[key](state[key], action);
      }
      return nextState as {
         [K in keyof R]: ReturnType<R[K]>;
      };
   };

   // --- Extract initial state from reducers ---
   const initialState = Object.keys(store.reducers).reduce((acc, key) => {
      const reducer: any = store.reducers[key];
      acc[key] = reducer.initialState;
      return acc;
   }, {} as any);

   return {
      initialState: initialState as { [K in keyof R]: ReturnType<R[K]> },
      reducers: rootReducer,
      middlewares: store.middlewares,
   };
}
