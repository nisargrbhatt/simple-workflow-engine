import type { FC, ReactNode } from 'react';
import ThemeContextProvider from './ThemeContext';

interface Props {
  children: ReactNode;
}

const ContextFactory: FC<Props> = ({ children }) => <ThemeContextProvider>{children}</ThemeContextProvider>;

export default ContextFactory;
