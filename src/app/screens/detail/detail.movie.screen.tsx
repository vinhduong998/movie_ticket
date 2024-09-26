import { RouteProp, useRoute } from '@react-navigation/native';
import ImageBase from 'app/component/core/ImageBase';
import TextBase from 'app/component/core/TextBase';
import TextBaseEllipsis from 'app/component/core/TextBase/text.base.ellipsis';
import { BOOKING_SCREEN_ROUTE } from 'app/configs/router.config';
import navigationHelper from 'app/helpers/navigation.helper';
import { updateItem } from 'app/helpers/sqlite.helper';
import { useDebounceState } from 'app/hooks/debounce.hook';
import { RootStackList } from 'app/navigation/type.navigation';
import { useTheme } from 'app/theme';
import { SystemTheme } from 'app/theme/theme.context';
import { Device } from 'app/ui/device.ui';
import { Shadow3 } from 'app/ui/shadow.ui';
import { HIT_SLOP_EXPAND_10, HS, MHS, VS } from 'app/ui/sizes.ui';
import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const DetailMovieScreen = () => {
  const { styles, theme } = useTheme(createStyles)
  const route = useRoute<RouteProp<RootStackList>>()

  const movie = route.params?.movie
  const [booked, setBooked] = useState(movie?.is_booked)

  useEffect(() => {
    return () => {
      if (movie?.id) {
        DeviceEventEmitter.removeAllListeners(movie.id)
      }
    }
  }, [])

  const onChangeFavorite = async (value: boolean) => {
    if (movie?.id) {
      DeviceEventEmitter.emit(movie.id, value)
    }
  }

  const { active: favorite, onChange: onPressFavorite } = useDebounceState(movie?.is_favorite || false, 500, onChangeFavorite)

  const onPressBooked = () => {
    if (!movie) {
      return
    }
    const _newItem = {
      ...movie,
      is_booked: true,
      date_booked: new Date().toISOString()
    }
    setBooked(true)
    DeviceEventEmitter.emit("change_item", _newItem)
    updateItem(_newItem)
    navigationHelper.navigate(BOOKING_SCREEN_ROUTE)
  }


  if (!movie) {
    return null
  }

  return (
    <View style={styles.container}>
      <ScrollView bouncesZoom={false} bounces={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: VS._20, gap: VS._10 }}>
        <ImageBase source={{ uri: movie.thumbnail }} style={{ width: Device.width, height: VS._200 }} />
        <View style={{ paddingHorizontal: HS._16, gap: VS._10 }}>
          <TextBase title={movie.title} fontSize={16} fontWeight={600} />
          <TextBaseEllipsis title={movie.description} width={Device.width - HS._32} numberOfLines={5} />
        </View>
      </ScrollView>
      <View style={styles.footerZeroBottom}>
        <Pressable style={favorite ? styles.actionFooterActive : styles.actionFooter} onPress={onPressFavorite} hitSlop={HIT_SLOP_EXPAND_10}>
          <TextBase color={favorite ? theme.background : theme.secondaryColor} fontSize={15} fontWeight={"600"} title={favorite ? "Saved" : "Save"} />
        </Pressable>
        <Pressable style={[styles.actionFooter]} disabled={Boolean(movie.is_booked)} onPress={onPressBooked}>
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