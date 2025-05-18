import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ThemeContextProvider from "./contexts/ThemeContext";
import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./app/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DefinitionsPage from "./app/definitions/page";
import { Layout } from "./components/layout/Layout";
import CreateDefinitionPage from "./app/definitions/create/page";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "definitions",
        element: <DefinitionsPage />,
      },
      {
        path: "definitions/create",
        element: <CreateDefinitionPage />,
      },
    ],
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
