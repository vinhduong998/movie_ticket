import { useTheme } from 'app/theme';
import { Device } from 'app/ui/device.ui';
import { HIT_SLOP_EXPAND_20, HS } from 'app/ui/sizes.ui';
import { useCallback, useRef, useState } from 'react';
import { NativeSyntheticEvent, Pressable, StyleSheet, TextLayoutEventData, TextStyle, View } from 'react-native';
import TextBase from '.';

interface TextBaseEllipsisProps {
  title: string;
  numberOfLines?: number;
  backgroundColor?: string;
  width: number;
  textSize?: number;
  style?: TextStyle;
}

const TextBaseEllipsis = ({ title, numberOfLines = 3, backgroundColor = "", width, textSize = 14, style = {} }: TextBaseEllipsisProps) => {
  const { theme } = useTheme()
  const _backgroundColor = backgroundColor || theme.background

  const [showMore, setShowMore] = useState<boolean | null>(null)
  const currentLeft = useRef(0)

  const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (event.nativeEvent?.lines?.length > numberOfLines) {
      if (Device.isAndroid) {
        currentLeft.current = event.nativeEvent?.lines?.[numberOfLines - 1]?.width || 0
      } else {
        currentLeft.current = (event.nativeEvent?.lines?.[numberOfLines - 1]?.text === "\n" ? event.nativeEvent?.lines?.[numberOfLines]?.width : event.nativeEvent?.lines?.[numberOfLines - 1]?.width) || 0
      }
      setShowMore(false)
    }
  }

  const _handleCollapse = useCallback(() => {
    if (currentLeft.current > 0) {
      setShowMore(prev => !prev)
    }
  }, [])


  return (
    <View style={[styles.container, { backgroundColor: _backgroundColor }, style]} >
      <TextBase onPress={_handleCollapse} numberOfLines={showMore ? undefined : numberOfLines} fontSize={textSize} >
        {title}
      </TextBase>
      {
        showMore === false && (
          <Pressable hitSlop={HIT_SLOP_EXPAND_20} style={[styles.textSeeMore, { backgroundColor: _backgroundColor }, currentLeft.current >= width - HS._72 ? { right: 0 } : { left: currentLeft.current }]} onPress={() => setShowMore(true)}>
            <TextBase title={"See more"} color={theme.mainColor} style={{ textDecorationLine: "underline" }} fontSize={textSize} />
          </Pressable>
        )
      }
      {
        showMore !== true && (
          <TextBase title={title} style={{ position: "absolute", opacity: 0, zIndex: -1 }
          } onTextLayout={onTextLayout} fontSize={textSize} />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  textSeeMore: {
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    paddingLeft: HS._6,
    width: "100%"
  }
})

export default TextBaseEllipsis;
