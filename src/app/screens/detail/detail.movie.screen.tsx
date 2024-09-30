import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import ImageBase from 'app/component/core/ImageBase';
import TextBase from 'app/component/core/TextBase';
import TextBaseEllipsis from 'app/component/core/TextBase/text.base.ellipsis';
import { BOOKING_SCREEN_ROUTE } from 'app/configs/router.config';
import navigationHelper from 'app/helpers/navigation.helper';
import { getItem, updateItem } from 'app/helpers/sqlite.helper';
import { useDebounceState } from 'app/hooks/debounce.hook';
import { useMounted } from 'app/hooks/mount.hook';
import { RootStackList } from 'app/navigation/type.navigation';
import { useTheme } from 'app/theme';
import { SystemTheme } from 'app/theme/theme.context';
import { Device } from 'app/ui/device.ui';
import { Shadow3 } from 'app/ui/shadow.ui';
import { HIT_SLOP_EXPAND_10, HS, MHS, VS } from 'app/ui/sizes.ui';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { DeviceEventEmitter, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const DetailMovieScreen = () => {
  const { styles, theme } = useTheme(createStyles)
  const route = useRoute<RouteProp<RootStackList>>()
  const navigation = useNavigation()

  const movie = route.params?.movie;
  const [detailMovie, setDetailMovie] = useState<TMovie | undefined>(undefined)

  const [booked, setBooked] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: detailMovie?.title
    })
  }, [detailMovie?.title])

  const onChangeFavorite = async (value: boolean) => {
    if (detailMovie?.id) {
      DeviceEventEmitter.emit(detailMovie.id, value)
      const newItem = {
        ...detailMovie,
        is_favorite: value,
        date_favorite: value ? new Date().toISOString() : null
      }
      updateItem(newItem)
    }
  }
  const { active: favorite, onChange: onPressFavorite, setActive: setFavorite } = useDebounceState(detailMovie?.is_favorite || false, 500, onChangeFavorite)

  useMounted(getItem(movie?.id), (data?: TMovie) => {
    if (data) {
      setBooked(Boolean(data.is_booked))
      setDetailMovie(data)
      setFavorite(Boolean(data.is_favorite))
    }
  })

  useEffect(() => {
    return () => {
      if (detailMovie?.id) {
        DeviceEventEmitter.removeAllListeners(detailMovie.id)
      }
    }
  }, [])

  const onPressBooked = () => {
    if (!detailMovie) {
      return
    }
    if (detailMovie.is_booked) {
      navigationHelper.navigate(BOOKING_SCREEN_ROUTE)
      return
    }
    const _newItem = {
      ...detailMovie,
      is_booked: true,
      date_booked: new Date().toISOString()
    }
    setBooked(true)
    DeviceEventEmitter.emit("change_item", _newItem)
    updateItem(_newItem)
    navigationHelper.navigate(BOOKING_SCREEN_ROUTE)
  }


  if (!detailMovie) {
    return null
  }

  return (
    <View testID='detail-movie' style={styles.container}>
      <ScrollView bouncesZoom={false} bounces={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: VS._20, gap: VS._10 }}>
        <ImageBase source={{ uri: detailMovie.thumbnail }} style={{ width: Device.width, height: VS._200 }} sharedTag={true} />
        <View style={{ paddingHorizontal: HS._16, gap: VS._10 }}>
          <TextBase title={detailMovie.title} fontSize={16} fontWeight={600} />
          <TextBaseEllipsis title={detailMovie.description} width={Device.width - HS._32} numberOfLines={5} />
        </View>
      </ScrollView>
      <View style={styles.footerZeroBottom}>
        <Pressable testID='detail-button-favorite' style={favorite ? styles.actionFooterActive : styles.actionFooter} onPress={onPressFavorite} hitSlop={HIT_SLOP_EXPAND_10}>
          <TextBase color={favorite ? theme.background : theme.secondaryColor} fontSize={15} fontWeight={"600"} title={favorite ? "Saved" : "Save"} />
        </Pressable>
        <Pressable testID='detail-button-booking' style={[styles.actionFooter]} onPress={onPressBooked}>
          <TextBase color={theme.secondaryColor} fontSize={15} fontWeight={"600"} title={booked ? "Booked" : "Book"} />
        </Pressable>
      </View>
    </View>
  )
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    footerZeroBottom: {
      marginBottom: Device.paddingBottom,
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

export default DetailMovieScreen;