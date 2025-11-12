import type { ActionType } from "utils";

type Dispatch<State, Action> = (action: Action | ThunkAction<State, Action>) => any;

type ThunkAction<State = any, Action = ActionType<any>> = (
   dispatch: Dispatch<State, Action>, //
   getState: () => State
) => any;

type Middleware<State = any, Action = any> = (api: { dispatch: (a: Action) => any; getState: () => State }) => (next: (a: Action) => any) => (action: Action) => any;

const DispatchMiddleware: Middleware = (api) => (next) => (action) => {
   if (typeof action === "function") return action(api.dispatch, api.getState);
   return next(action);
};

export { DispatchMiddleware, type Middleware };
