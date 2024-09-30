import { useIsFocused, useNavigation } from '@react-navigation/native';
import ListBase, { TypedRefBaseListCustom } from 'app/component/core/List/list.base';
import { getDataPagination } from 'app/helpers/sqlite.helper';
import { useTheme } from 'app/theme';
import { SystemTheme } from 'app/theme/theme.context';
import { VS } from 'app/ui/sizes.ui';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { DeviceEventEmitter, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import ItemMovieHomeComponent, { NAME_SCREEN } from '../home/component/item.movie.home';
import LoadingHome from '../home/component/loading.home';

const LIMIT = 12

const BookingScreen = () => {
  const { styles } = useTheme(createStyles)
  const listRef = useRef<TypedRefBaseListCustom<TMovie>>(null)

  const isFocused = useIsFocused()

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Booking"
    })
  }, [])

  useEffect(() => {
    if (isFocused) {
      listRef.current?.refresh()
    }
  }, [isFocused])

  const getData = async (page = 1) => {
    const data = await getDataPagination(page, LIMIT, undefined, true)
    return data
  }

  const onFavorite = (data: TMovie) => {
    DeviceEventEmitter.emit("change_item", data)
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<TMovie>) => {
    return (
      <ItemMovieHomeComponent item={item} index={index} onFavorite={onFavorite} name={NAME_SCREEN.BOOKING} />
    )
  }

  return (
    <Animated.View testID={'booking'} style={styles.container} layout={LinearTransition.springify().damping(80).stiffness(200)}>
      <ListBase<TMovie>
        ref={listRef}
        testID='booking-list'
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onRefreshProp={getData}
        onLoadMoreProp={getData}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        limit={LIMIT}
        skeleton={() => <LoadingHome testID='loading-booking' />}
      />
    </Animated.View>
  )
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    itemSeparator: {
      height: VS._10,
      width: "100%",
      backgroundColor: "#dedede",
      marginVertical: VS._10
    }
  })
}

export default BookingScreen;