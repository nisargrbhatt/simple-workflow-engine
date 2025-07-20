import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import HomePage from './app/page';
import DefinitionsPage from './app/definitions/page';
import { Layout } from './components/layout/Layout';
import CreateDefinitionPage from './app/definitions/create/page';
import DefinitionDetailPage from './app/definitions/[id]/page';

const router = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'definitions',
        element: <DefinitionsPage />,
      },
      {
        path: 'definitions/create',
        element: <CreateDefinitionPage />,
      },
      {
        path: 'definitions/:id',
        element: <DefinitionDetailPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
