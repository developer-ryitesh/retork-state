import { useReducer, type Dispatch, type ReactNode } from "react";
import type { createStore } from "../utils/index";
import { createContext } from "react";
import { DispatchMiddleware } from "middlewares";

/* --- [StoreContext] --- */
type StoreContextType = {
   state: ReturnType<typeof createStore>;
   dispatch: Dispatch<any> & { withPromise: (action: any) => Promise<any> };
};

type Props = {
   children: ReactNode;
   store: ReturnType<typeof createStore>;
};

//--------StoreContext-----------
const StoreContext = createContext<StoreContextType>(undefined as any);

//--------StoreProvider-----------
const StoreProvider = ({ children, store }: Props) => {
   const [state, baseDispatch] = useReducer(store.reducers, store.initialState);

   const coreDispatch = [DispatchMiddleware, ...(store.middlewares as any)].reduceRight((next, mw) => mw({ dispatch: next, getState: () => state })(next), baseDispatch);

   // Add unwrap functionality
   const dispatchWithPromise = Object.assign(coreDispatch, {
      withPromise: (action: any) => {
         try {
            const result = coreDispatch(action);
            if (result instanceof Promise) {
               return result;
            }
            return Promise.resolve(result);
         } catch (err) {
            return Promise.reject(err);
         }
      },
   });

   return (
      // @ts-ignore
      <StoreContext.Provider value={{ state, dispatch: dispatchWithPromise }}>
         {/*  */}
         {children}
         {/*  */}
      </StoreContext.Provider>
   );
};

export { StoreProvider, StoreContext };
