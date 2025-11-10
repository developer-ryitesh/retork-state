import { useContext } from "react";
import { StoreContext } from "../providers";

/* --- [useAppDispatch hook] --- */
const useAppDispatch = () => {
   const context = useContext(StoreContext);
   if (!context) {
      throw new Error("useAppDispatch must be used within a StoreProvider");
   }
   return context.dispatch;
};

/* --- [useSelector hook] --- */
function useSelector<State, Selected>(selector: (state: State) => Selected): Selected {
   const context = useContext(StoreContext);
   if (!context) {
      throw new Error("useSelector must be used within a StoreProvider");
   }
   return selector(context.state as State);
}

export { useAppDispatch, useSelector };
