import ImageBase from 'app/component/core/ImageBase';
import TextBase from 'app/component/core/TextBase';
import { DETAIL_MOVIE_SCREEN_ROUTE } from 'app/configs/router.config';
import navigationHelper from 'app/helpers/navigation.helper';
import { getDataPagination } from 'app/helpers/sqlite.helper';
import { useTheme } from 'app/theme';
import { SystemTheme } from 'app/theme/theme.context';
import { Device } from 'app/ui/device.ui';
import { HS, MHS, VS } from 'app/ui/sizes.ui';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { Extrapolation, interpolate, interpolateColor, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const LIMIT = 10
const PADDING = 48
const WIDTH_DOT = 10
const WIDTH_ITEM = Math.round(Device.width - 2 * PADDING)
const ASPECT_RATIO = 6 / 7

interface ItemProps {
  item: TMovie
  index: number
  x: SharedValue<number>
  length: number
}

const ItemTrending = ({ item, index, x, length }: ItemProps) => {
  const { styles } = useTheme(createStyles)
  const styleItem = useAnimatedStyle(() => {
    const _index = Math.floor(x.value >= 0 ? x.value % length : length + x.value % length)

    // item right
    if (_index === index - 1 || (_index === length - 1 && index === 0)) {
      const _indexR = Math.floor(x.value) + 1
      const input = [_indexR - 1, _indexR]
      return {
        zIndex: 99,
        transform: [
          { translateX: interpolate(x.value, input, [-WIDTH_ITEM, 0], Extrapolation.CLAMP) },
          { scale: interpolate(x.value, input, [0.85, 1], Extrapolation.CLAMP) },
          { rotateY: `${interpolate(x.value, input, [75, 0], Extrapolation.CLAMP)}deg` }
        ]
      }
    }

    // item center
    if (_index === index) {
      let _indexC = Math.floor(x.value)
      const input = [_indexC - 1, _indexC, _indexC + 1]

      return {
        zIndex: 100,
        transform: [
          { translateX: interpolate(x.value, input, [-WIDTH_ITEM, 0, WIDTH_ITEM], Extrapolation.CLAMP) },
          { scale: interpolate(x.value, input, [0.85, 1, 0.85], Extrapolation.CLAMP) },
          { rotateY: `${interpolate(x.value, input, [75, 0, -75], Extrapolation.CLAMP)}deg` }
        ],
      }
    }

    // item left
    if (_index === index + 1 || (_index === 0 && index === length - 1)) {
      const _indexL = Math.floor(x.value) - 1
      const input = [_indexL, _indexL + 1]

      return {
        zIndex: 99,
        transform: [
          { translateX: interpolate(x.value, input, [0, WIDTH_ITEM], Extrapolation.CLAMP) },
          { scale: interpolate(x.value, input, [1, 0.85], Extrapolation.CLAMP) },
          { rotateY: `${interpolate(x.value, input, [0, -60], Extrapolation.CLAMP)}deg` }
        ]
      }
    }
    return {
      zIndex: 0,
      transform: [
        { translateX: -2 * Device.width }
      ]
    }

  })

  const gesture = Gesture.Pan()
    .onChange(({ changeX }) => {
      x.value += Math.round(changeX) / WIDTH_ITEM
    })
    .onEnd(() => {
      x.value = withTiming(Math.round(x.value), { duration: 200 })
    })

  const onPressItem = () => {
    navigationHelper.navigate(DETAIL_MOVIE_SCREEN_ROUTE, { movie: item })
  }

  return (
    <GestureDetector gesture={gesture}>
      <TouchableWithoutFeedback onPress={onPressItem}>
        <Animated.View style={[styles.item, styleItem]}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0, 0.6, 0.7, 0.8, 1]}
            colors={["#00000000", "#00000000", "#00000060", "#00000080", "#000000"]}
            style={styles.overlay}
          >
            <TextBase title={item.title} numberOfLines={1} fontSize={30} fontWeight={"600"} color={"white"} />
          </LinearGradient>
          <ImageBase cache={true} source={{ uri: item.thumbnail }} style={{ width: WIDTH_ITEM, aspectRatio: ASPECT_RATIO }} resizeMode='cover' />
        </Animated.View>
      </TouchableWithoutFeedback>
    </GestureDetector>
  )
}

const ItemDot = ({ x, list, index }: { index: number, x: SharedValue<number>, list: TMovie[] }) => {
  const { styles } = useTheme(createStyles)
  const styleDot = useAnimatedStyle(() => {
    const _index = x.value >= 0 ? x.value % list.length : list.length + x.value % list.length
    const input = index === 0 ? [-1, 0, 1] : [list.length - (index + 1), list.length - index, list.length - (index - 1)]

    return {
      backgroundColor: interpolateColor(_index, input, ["#00000030", "#000000", "#00000030"], "RGB")
    }
  })
  return (
    <Animated.View style={[styles.dot, styleDot]} />
  )
}

const TrendingHomeComponent = () => {
  const { styles } = useTheme(createStyles)
  const [loading, setLoading] = useState(true)
  const [listMovieTrending, setListMovieTrending] = useState<TMovie[]>([])
  const x = useSharedValue(10000)

  const dataRef = useRef<TMovie[]>([])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const data = await getDataPagination(3, LIMIT)
    const _newData = data.map((i, id) => ({
      ...i,
      index: id
    }))
    dataRef.current = _newData
    setLoading(false)
    setListMovieTrending(_newData)
  }

  const renderItem = ({ item, index }: { item: TMovie, index: number }) => {
    return (
      <ItemTrending key={item.id} item={item} index={index} x={x} length={listMovieTrending.length} />
    )
  }

  // if (loading) {
  //   return (
  //     <View />
  //   )
  // }

  return (
    <View testID='trending' style={styles.container}>
      <View style={styles.viewCarousel}>
        {
          listMovieTrending.map((item, index) => renderItem({ item, index }))
        }
      </View>
      <View style={styles.pagination}>
        {listMovieTrending.map((_, index) => <ItemDot key={`dot1-${index}`} index={index} list={listMovieTrending} x={x} />)}
      </View>
    </View>
  )
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      marginVertical: VS._20,
      gap: VS._20
    },
    viewCarousel: {
      height: WIDTH_ITEM / ASPECT_RATIO
    },
    item: {
      width: WIDTH_ITEM,
      borderRadius: MHS._10,
      overflow: "hidden",
      position: "absolute",
      marginHorizontal: PADDING
    },
    pagination: {
      flexDirection: "row",
      alignItems: "center",
      gap: HS._6,
      alignSelf: "center"
    },
    dot: {
      width: WIDTH_DOT,
      height: WIDTH_DOT,
      borderRadius: WIDTH_DOT
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 100,
      paddingHorizontal: 10,
      justifyContent: "flex-end",
      paddingBottom: 10
    }
  })
}

export default TrendingHomeComponent;