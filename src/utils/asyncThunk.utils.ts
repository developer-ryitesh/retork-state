import { useAppDispatch } from "hooks";

export interface ThunkAPI<State, Extra, RejectedValue> {
   dispatch: ReturnType<typeof useAppDispatch>;
   getState: () => State;
   extra: Extra;
   requestId: string;
   signal: AbortSignal;
   rejectWithValue: (value: RejectedValue) => any;
}

/* ---  [async Thunk] --- */

function asyncThunk<Arg = void, Returned = any, State = any, Extra = unknown, RejectedValue = unknown>(
   typePrefix: string,
   payloadCreator: (arg: Arg, thunkAPI: ThunkAPI<State, Extra, RejectedValue>) => Promise<Returned> | Returned
) {
   const pending = `${typePrefix}/pending`;
   const fulfilled = `${typePrefix}/fulfilled`;
   const rejected = `${typePrefix}/rejected`;

   const thunk = function (arg: Arg) {
      return async (dispatch: ReturnType<typeof useAppDispatch>, getState: () => State, extra: Extra) => {
         const requestId = crypto.randomUUID();
         const abortController = new AbortController();

         const thunkAPI: ThunkAPI<State, Extra, RejectedValue> = {
            dispatch,
            getState,
            extra,
            requestId,
            signal: abortController.signal,
            rejectWithValue(value) {
               return {
                  __rtkRejectWithValue: true,
                  payload: value,
               };
            },
         };

         dispatch({
            type: pending,
            meta: { arg, requestId },
         });

         try {
            const result = await payloadCreator(arg, thunkAPI);

            if ((result as any)?.__rtkRejectWithValue) {
               dispatch({
                  type: rejected,
                  payload: (result as any).payload,
                  error: null,
                  meta: { arg, requestId, rejectedWithValue: true },
               });
               return (result as any).payload;
            }

            dispatch({
               type: fulfilled,
               payload: result,
               meta: { arg, requestId },
            });

            return result;
         } catch (error: any) {
            dispatch({
               type: rejected,
               error: error?.message || error,
               meta: { arg, requestId },
            });

            throw error;
         }
      };
   };

   // 🔥 Add static fields — same as RTK
   thunk.pending = pending;
   thunk.fulfilled = fulfilled;
   thunk.rejected = rejected;

   return thunk;
}

export { asyncThunk };
