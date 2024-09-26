import { useScrollToTop } from '@react-navigation/native';
import TextBase from 'app/component/core/TextBase';
import { getDataPagination } from 'app/helpers/sqlite.helpter';
import { useTheme } from 'app/theme';
import { SystemTheme } from 'app/theme/theme.context';
import { VS } from 'app/ui/sizes.ui';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import ItemMovieHomeComponent from './item.movie.home';
import TrendingHomeComponent from './trending.home';

const LIMIT = 12

const ListHomeComponent = () => {
  const { styles, theme } = useTheme(createStyles)
  const [listMovie, setListMovie] = useState<TMovie[]>([])
  const [isEndList, setIsEndList] = useState(false)
  const [loading, setLoading] = useState(true)
  const pageRef = useRef(1)
  const hasScrolled = useRef(false)

  // scroll to top when press button in bottom bar
  const flatlistRef = useRef<FlatList>(null);
  useScrollToTop(flatlistRef)


  // ----- useEffect
  const getData = async () => {
    const data = await getDataPagination(1, LIMIT)
    setLoading(false)

    if (data.length === 0) {
      setIsEndList(true)
      return
    }
    setListMovie(data)
  }

  useEffect(() => {
    if (loading) {
      getData()
    }
  }, [loading])

  // useMounted(getData(), (data) => {
  //   console.log("dataRefresh", data?.length);

  //   setLoading(false)
  //   if (!data) {
  //     return
  //   }

  //   if (data.length === 0) {
  //     setIsEndList(true)
  //     return
  //   }
  //   setListMovie(data)
  // }, [loading])
  // ----- end useEffect

  // ----- function
  const onRefresh = () => {
    pageRef.current = 1
    setLoading(true)
  }

  const handleMoreData = async () => {
    if (!hasScrolled.current) {
      return
    }
    const data = await getDataPagination(pageRef.current + 1, LIMIT)
    hasScrolled.current = false;
    if (data.length === 0) {
      setIsEndList(true)
      return
    }
    pageRef.current += 1
    setListMovie(prev => ([...prev, ...data]))
  }

  // ----- end function

  // ----- component
  const EmptyComponent = useMemo(() => {
    return (
      <View style={[styles.viewEmpty]}>
        <TextBase title={"Not found"} fontSize={26} fontWeight="700" style={{ textAlign: "center" }} />
      </View>
    )
  }, [])

  const FooterComponent = useMemo(() => {
    if (isEndList) return <TextBase title={"No new post"} style={styles.bottomView} />
    return (
      <ActivityIndicator color={theme.mainColor} size={"large"} style={styles.bottomView} />
    )
  }, [isEndList]);

  const renderItem = ({ item }: { item: TMovie }) => {
    return (
      <ItemMovieHomeComponent item={item} />
    )
  }

  const ListHeaderComponent = useCallback(() => {
    return (
      <TrendingHomeComponent />
    )
  }, [])

  console.log("listMovie", listMovie.length);


  // ----- end component

  // render
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatlistRef}
        data={listMovie}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEventThrottle={16}
        extraData={listMovie}
        onEndReachedThreshold={2}
        onEndReached={handleMoreData}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        ListEmptyComponent={EmptyComponent}
        ListFooterComponent={FooterComponent}
        ListHeaderComponent={ListHeaderComponent}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
        onScrollBeginDrag={() => hasScrolled.current = true}
        onScrollEndDrag={() => hasScrolled.current = true}
        // progressViewOffset={HEADER_HEIGHT}
        updateCellsBatchingPeriod={3000}
        windowSize={61}
        initialNumToRender={4}
        maxToRenderPerBatch={3}
        // contentContainerStyle={{ gap: VS._20 }}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </View>
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