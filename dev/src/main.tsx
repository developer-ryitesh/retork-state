import { createRoot } from "react-dom/client";
import App from "./app/app";
import { StoreProvider } from "@retork/state";
import store from "./app/store";

createRoot(document.getElementById("root")!).render(
   <StoreProvider store={store}>
      <App />
   </StoreProvider>
);
