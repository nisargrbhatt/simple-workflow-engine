import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FC, ReactNode } from 'react';
import ThemeContextProvider from './ThemeContext';

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
}

const ContextFactory: FC<Props> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeContextProvider>{children}</ThemeContextProvider>
  </QueryClientProvider>
);

export default ContextFactory;
