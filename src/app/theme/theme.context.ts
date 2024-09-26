import { createContext } from 'react';
import { ColorValue } from 'react-native';

export type SystemTheme = {
  background: ColorValue
  text: ColorValue
  mainColor: ColorValue
  smoke: ColorValue
  secondaryColor: ColorValue
}

export const RootColor = {
  Transparent: "#00000000",
  DarkBackground: "#212121",
  LightBackground: "#FFF",
  MainColor: "#a51c30",
  DarkText: "#0E1426",
  LightText: "#FFF",
  Smoke: "#D9D9D9",
  SecondaryColor: "#626F82",
}

export const themes: {
  light: SystemTheme,
  dark: SystemTheme
} = {
  light: {
    background: RootColor.LightBackground,
    text: RootColor.DarkText,
    mainColor: RootColor.MainColor,
    smoke: RootColor.Smoke,
    secondaryColor: RootColor.SecondaryColor
  },
  dark: {
    background: RootColor.DarkBackground,
    text: RootColor.DarkText,
    mainColor: RootColor.MainColor,
    smoke: RootColor.Smoke,
    secondaryColor: RootColor.SecondaryColor
  },
};

export const ThemeContext = createContext({ theme: themes.light, switchTheme: () => { } });