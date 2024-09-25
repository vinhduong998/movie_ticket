import { createContext } from 'react';
import { ColorValue } from 'react-native';

export type SystemTheme = {
  background: ColorValue
  text: ColorValue
  mainColor: ColorValue
}

export const RootColor = {
  Transparent: "#00000000",
  DarkBackground: "#212121",
  LightBackground: "#FFF",
  MainColor: "#a51c30",
  DarkText: "#0E1426",
  LightText: "#FFF",
}

export const themes: {
  light: SystemTheme,
  dark: SystemTheme
} = {
  light: {
    background: RootColor.LightBackground,
    text: RootColor.DarkText,
    mainColor: RootColor.MainColor
  },
  dark: {
    background: RootColor.DarkBackground,
    text: RootColor.DarkText,
    mainColor: RootColor.MainColor
  },
};

export const ThemeContext = createContext({ theme: themes.light, switchTheme: () => { } });