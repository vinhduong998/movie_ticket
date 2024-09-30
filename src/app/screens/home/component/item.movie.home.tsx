import ImageBase from 'app/component/core/ImageBase';
import TextBase from 'app/component/core/TextBase';
import { DETAIL_MOVIE_SCREEN_ROUTE } from 'app/configs/router.config';
import navigationHelper from 'app/helpers/navigation.helper';
import { updateItem } from 'app/helpers/sqlite.helper';
import { useDebounceState } from 'app/hooks/debounce.hook';
import { useTheme } from 'app/theme';
import { SystemTheme } from 'app/theme/theme.context';
import { Device } from 'app/ui/device.ui';
import { Shadow3 } from 'app/ui/shadow.ui';
import { HIT_SLOP_EXPAND_10, HS, MHS, VS } from 'app/ui/sizes.ui';
import React, { memo, useCallback, useEffect } from 'react';
import { DeviceEventEmitter, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

interface ItemProps {
  item: TMovie
  onFavorite?: (data: TMovie) => void
  name: NAME_SCREEN
  index: number
}

export enum NAME_SCREEN {
  HOME = "home",
  FAVORITE = "favorite",
  BOOKING = "booking"
}

const ItemMovieHomeComponent = ({ item, onFavorite, name, index }: ItemProps) => {
  const { styles, theme } = useTheme(createStyles)

  const updateLocalData = useCallback(async (value: boolean) => {
    const newItem = {
      ...item,
      is_favorite: value,
      date_favorite: value ? new Date().toISOString() : null
    }
    onFavorite?.(newItem)
    updateItem(newItem)
  }, [])

  const { active: favorite, onChange: onPressFavorite, setActive: setFavorite } = useDebounceState(item.is_favorite, 500, updateLocalData)

  useEffect(() => {
    setFavorite(Boolean(item.is_favorite))
  }, [item])

  const onPressMovie = useCallback(() => {
    DeviceEventEmitter.addListener(item.id, setFavorite)
    navigationHelper.navigate(DETAIL_MOVIE_SCREEN_ROUTE, {
      movie: {
        ...item,
        is_favorite: favorite
      }
    })
  }, [])

  return (
    <TouchableWithoutFeedback onPress={onPressMovie} testID={`${name}-${index}`}>
      <Animated.View
        key={item.id}
        style={{ gap: VS._10 }}
        entering={FadeInLeft.springify().damping(80).stiffness(200)}
      >
        <ImageBase cache={true} source={{ uri: item.thumbnail }} style={{ width: Device.width, height: VS._200 }} sharedTag={true} />
        <View style={{ paddingHorizontal: HS._16, gap: VS._6 }}>
          <TextBase title={item.title} fontSize={16} fontWeight={600} numberOfLines={2} />
          <TextBase title={item.description} numberOfLines={3} />
        </View>
        <View style={styles.footerZeroBottom}>
          <Pressable testID={`${name}-button-${index}`} style={favorite ? styles.actionFooterActive : styles.actionFooter} onPress={onPressFavorite} hitSlop={HIT_SLOP_EXPAND_10}>
            <TextBase color={favorite ? theme.background : theme.secondaryColor} fontSize={15} fontWeight={"600"} title={favorite ? "Saved" : "Save"} />
          </Pressable>
          {
            name !== "booking" && (
              <Pressable style={[styles.actionFooter]} onPress={onPressMovie}>
                <TextBase color={theme.secondaryColor} fontSize={15} fontWeight={"600"} title={Boolean(item.is_booked) ? "Booked" : "Book"} />
              </Pressable>
            )
          }
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    footerZeroBottom: {
      flexDirection: "row",
      borderBottomWidth: 0,
      paddingVertical: VS._6,
      borderBottomColor: theme.smoke
    },
    actionFooter: {
      flexDirection: "row",
      alignItems: "center",
      gap: HS._6,
      justifyContent: "center",
      paddingVertical: VS._6,
      borderRadius: MHS._6,
      paddingHorizontal: HS._10,
      flex: 1,
      marginHorizontal: HS._20,
      borderWidth: 0.75,
      borderColor: theme.smoke,
      ...Shadow3,
      backgroundColor: theme.background
    },
    actionFooterActive: {
      flexDirection: "row",
      alignItems: "center",
      gap: HS._6,
      justifyContent: "center",
      paddingVertical: VS._4,
      borderRadius: MHS._6,
      paddingHorizontal: HS._10,
      flex: 1,
      marginHorizontal: HS._20,
      backgroundColor: theme.mainColor,
      ...Shadow3,
    }
  })
}

export default memo(ItemMovieHomeComponent);