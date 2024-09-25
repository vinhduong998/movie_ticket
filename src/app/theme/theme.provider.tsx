import React, { PropsWithChildren, useState } from 'react';
import { ThemeContext, themes } from './theme.context';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme: theme ==="light" ? themes.light : themes.dark, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};