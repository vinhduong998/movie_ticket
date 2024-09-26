import ImageBase from 'app/component/core/ImageBase';
import TextBase from 'app/component/core/TextBase';
import TextBaseEllipsis from 'app/component/core/TextBase/text.base.ellipsis';
import { DETAIL_MOVIE_SCREEN_ROUTE } from 'app/configs/router.config';
import navigationHelper from 'app/helpers/navigation.helper';
import { updateItem } from 'app/helpers/sqlite.helpter';
import { useDebounceState } from 'app/hooks/debounce.hook';
import { useTheme } from 'app/theme';
import { SystemTheme } from 'app/theme/theme.context';
import { Device } from 'app/ui/device.ui';
import { Shadow3 } from 'app/ui/shadow.ui';
import { HIT_SLOP_EXPAND_10, HS, MHS, VS } from 'app/ui/sizes.ui';
import React, { useState } from 'react';
import { DeviceEventEmitter, Pressable, StyleSheet, View } from 'react-native';

interface ItemProps {
  item: TMovie
}

const ItemMovieHomeComponent = ({ item }: ItemProps) => {
  const { styles, theme } = useTheme(createStyles)
  const [booked, setBooked] = useState(item.is_booked)

  const updateLocalData = async (value: boolean) => {
    updateItem({
      ...item,
      is_favorite: value
    })
  }

  const { active: favorite, onChange: onPressFavorite, setActive: setFavorite } = useDebounceState(item.is_favorite, 500, updateLocalData)

  const onPressMovie = () => {
    DeviceEventEmitter.addListener(item.id, (value: boolean) => {
      setFavorite(value)
      updateLocalData(value)
    })
    navigationHelper.navigate(DETAIL_MOVIE_SCREEN_ROUTE, {
      movie: {
        ...item,
        is_favorite: favorite
      }
    })
  }

  return (
    <Pressable style={{ gap: VS._10 }} onPress={onPressMovie}>
      <ImageBase source={{ uri: item.thumbnail }} style={{ width: Device.width, height: VS._200 }} />
      <View style={{ paddingHorizontal: HS._16, gap: VS._6 }}>
        <TextBase title={item.title} fontSize={16} fontWeight={600} numberOfLines={2} />
        <TextBase title={item.description} numberOfLines={3} />
      </View>
      <View style={styles.footerZeroBottom}>
        <Pressable style={favorite ? styles.actionFooterActive : styles.actionFooter} onPress={onPressFavorite} hitSlop={HIT_SLOP_EXPAND_10}>
          <TextBase color={favorite ? theme.background : theme.secondaryColor} fontSize={15} fontWeight={"600"} title={favorite ? "Saved" : "Save"} />
        </Pressable>
        <Pressable style={[styles.actionFooter]} onPress={onPressMovie}>
          <TextBase color={theme.secondaryColor} fontSize={15} fontWeight={"600"} title={booked ? "Booked" : "Book"} />
        </Pressable>
      </View>
    </Pressable>
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

export default ItemMovieHomeComponent;