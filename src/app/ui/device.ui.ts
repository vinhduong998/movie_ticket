import { Dimensions, Platform, StatusBar } from "react-native";
import { VS } from "./sizes.ui";

const { width, height } = Dimensions.get("window");

const isIos = Platform.OS === 'ios'

const isIphoneX = isIos
  && !Platform.isTV
  && !Platform.isTV
  && (height === 812 || width === 812);
const isIphoneXR = isIos
  && !Platform.isTV
  && !Platform.isTV
  && (height === 896 || width === 896)

const isIphone12 = isIos
  && !Platform.isTV
  && !Platform.isTV
  && (height === 844 || width === 844)
const isIphone12PM = isIos
  && !Platform.isTV
  && !Platform.isTV
  && (height === 926 || width === 926)
const isIphone14 = isIos
  && !Platform.isTV
  && !Platform.isTV
  && (height === 852 || width === 852)
const isIphone14PM = isIos
  && !Platform.isTV
  && !Platform.isTV
  && (height === 932 || width === 932)
const isX = isIphoneX || isIphoneXR || isIphone12 || isIphone12PM || isIphone14 || isIphone14PM
const safeAreaInsetX = { top: 44, bottom: 34 }


export const Device = {
  width,
  height,
  isWeb: Platform.OS === "web",
  isIos: isIos,
  isAndroid: Platform.OS === "android",
  isX,
  safeAreaInsetX,
  heightStatusBar: isIos ? safeAreaInsetX.top : (StatusBar.currentHeight || 0),
  paddingBottom: isX ? safeAreaInsetX.bottom / 2 : VS._20,
  heightScreen: Dimensions.get("screen").height
};
