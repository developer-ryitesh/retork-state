import { StoreContext } from "providers";
import { useContext } from "react";

function useSelector<State, Selected>(selector: (state: State) => Selected): Selected {
   const context = useContext(StoreContext);
   if (!context) {
      throw new Error("useSelector must be used within a StoreProvider");
   }
   return selector(context.state as State);
}

export { useSelector };
