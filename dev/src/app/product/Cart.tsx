import { useAppDispatch } from "@retork/state";
import { useAppSelector } from "../store";

export default function Cart() {
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
