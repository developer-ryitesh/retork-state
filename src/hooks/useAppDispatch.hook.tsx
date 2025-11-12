import { StoreContext } from "providers";
import { useContext } from "react";

const useAppDispatch = () => {
   const context = useContext(StoreContext);
   if (!context) {
      throw new Error("useAppDispatch must be used within a StoreProvider");
   }
   return context.dispatch;
};

export { useAppDispatch };
