// src/app/app.tsx
import AppProvider from "./provider";
import Router from "./router";

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
