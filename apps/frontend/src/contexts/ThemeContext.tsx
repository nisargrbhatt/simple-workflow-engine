import { TooltipProvider } from "@/components/ui/tooltip";
import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

interface Props {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

const ThemeContextProvider: FC<Props> = ({ children, defaultTheme = "system", storageKey = "vite-ui-theme" }) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const onThemeChange = useCallback(
    (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(() => theme);
    },
    [setTheme, storageKey]
  );

  return (
    <ThemeProviderContext.Provider
      value={{
        setTheme: onThemeChange,
        theme: theme,
      }}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProviderContext.Provider>
  );
};

export default ThemeContextProvider;
