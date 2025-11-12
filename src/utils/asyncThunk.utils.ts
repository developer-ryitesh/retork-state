import { ActionType } from "./createSlice.utils";

/* ---  [async Thunk] --- */
function asyncThunk<Type extends string, Fn extends (arg: any, thunkAPI: { dispatch: any }) => Promise<any>>(type: Type, asyncFn: Fn) {
   type Arg = Parameters<Fn>[0];
   type Return = Awaited<ReturnType<Fn>>;

   const thunk =
      (arg?: Arg extends undefined ? never : Arg) =>
      async (dispatch: any): Promise<Return> => {
         try {
            dispatch({ type: `${type}/pending` });
            const data = await asyncFn(arg as Arg, { dispatch });
            dispatch({ type: `${type}/fulfilled`, payload: data });
            return data;
         } catch (error) {
            dispatch({ type: `${type}/rejected`, error });
            throw error;
         }
      };

   return Object.assign(thunk, {
      pending: `${type}/pending`,
      fulfilled: `${type}/fulfilled`,
      rejected: `${type}/rejected`,
   });
}

export { asyncThunk };
