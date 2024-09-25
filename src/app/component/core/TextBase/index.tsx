import React, { memo } from "react";

import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import { MHS } from "app/ui/sizes.ui";
import { useTheme } from "app/theme";

interface Props extends TextProps {
  title?: string | string[];
  style?: TextStyle;
  fontSize?: number;
  fontWeight?: TextStyle["fontWeight"];
  color?: string;
  textAlign?: TextStyle["textAlign"]
}

const TextBase = (props: Props) => {
  const { style, title, children, fontSize = 14, fontWeight = "400", textAlign = "left", ...textProps } = props;
  const { theme } = useTheme()
  const color = props.color || theme.text;

  const _fontSize = MHS?.[`_${fontSize}` as keyof typeof MHS] || MHS?.[`_${style?.fontSize}` as keyof typeof MHS]

  if (!_fontSize) {
    console.warn("Not existing fontsize size: ", fontSize)
  }

  return (
    <Text
      {...textProps}
      allowFontScaling={false}
      style={[
        {
          fontSize: _fontSize,
          color,
          includeFontPadding: false,
        },
        { textAlign },
        { fontWeight: fontWeight },
        style,
      ]}
    >
      {title || ""}
      {children}
    </Text>
  )
}

export default memo(TextBase);
