import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ThemeContextProvider from "./contexts/ThemeContext";
import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./app/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <RouterProvider router={router} />
      </ThemeContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
