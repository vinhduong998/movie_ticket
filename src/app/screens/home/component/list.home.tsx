import ListBase, { TypedRefBaseListCustom } from 'app/component/core/List/list.base';
import { getDataPagination } from 'app/helpers/sqlite.helper';
import { useTheme } from 'app/theme';
import { SystemTheme } from 'app/theme/theme.context';
import { VS } from 'app/ui/sizes.ui';
import React, { useCallback, useEffect, useRef } from 'react';
import { DeviceEventEmitter, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import ItemMovieHomeComponent, { NAME_SCREEN } from './item.movie.home';
import LoadingHome from './loading.home';
import TrendingHomeComponent from './trending.home';

const LIMIT = 12

const ListHomeComponent = () => {
  const { styles } = useTheme(createStyles)
  const flatListRef = useRef<TypedRefBaseListCustom<TMovie>>(null)

  // ----- useEffect
  const getData = async (page = 1) => {
    const data = await getDataPagination(page, LIMIT)
    return data
  }

  useEffect(() => {
    DeviceEventEmitter.addListener("change_item", (data: TMovie) => {
      flatListRef.current?.setList(prev => prev.map(i => i.id === data.id ? data : i))
    })
    return () => {
      DeviceEventEmitter.removeAllListeners("change_item")
    }
  }, [])
  // ----- end useEffect

  // ----- component
  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<TMovie>) => {
    return (
      <ItemMovieHomeComponent item={item} name={NAME_SCREEN.HOME} index={index} />
    )
  }, [])

  const ListHeaderComponent = useCallback(() => {
    return (
      <TrendingHomeComponent />
    )
  }, [])

  // ----- end component

  // render
  return (
    <Animated.View style={styles.container} layout={LinearTransition.springify().damping(80).stiffness(200)}>
      <ListBase<TMovie>
        ref={flatListRef}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onRefreshProp={getData}
        onLoadMoreProp={getData}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        limit={LIMIT}
        skeleton={() => <LoadingHome testID={'loading-home'} />}
        ListHeaderComponent={ListHeaderComponent}
        testID='list-home'
      />
    </Animated.View>
  )
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {

    },
    viewEmpty: {
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: VS._60 + VS._16
    },
    bottomView: {
      marginVertical: VS._24,
      alignSelf: 'center'
    },
    itemSeparator: {
      height: VS._10,
      width: "100%",
      backgroundColor: "#dedede",
      marginVertical: VS._10
    }
  })
}

export default ListHomeComponent;