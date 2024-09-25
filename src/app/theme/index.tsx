import { useContext, useMemo } from "react";
import { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { SystemTheme, ThemeContext } from "./theme.context";

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function useTheme<T extends NamedStyles<T> | NamedStyles<any>>(createStyle?: (theme: SystemTheme) => T): {
  theme: SystemTheme
  styles: T
  switchTheme: () => void
} {
  const { theme, switchTheme } = useContext(ThemeContext)
  const styles = useMemo(() => {
    return createStyle?.(theme) || {} as T
  }, [theme]);

  return { theme, styles, switchTheme }
}