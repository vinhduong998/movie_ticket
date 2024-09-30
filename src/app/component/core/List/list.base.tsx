import React, {
  forwardRef,
  memo,
  ReactElement,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';

import { useScrollToTop } from '@react-navigation/native';
import { useTheme } from 'app/theme';
import { SystemTheme } from 'app/theme/theme.context';
import { HS, MHS, VS } from 'app/ui/sizes.ui';
import TextBase from '../TextBase';

interface Props<T> extends Omit<FlatListProps<T>, "data"> {
  scrollIndex?: number,
  onRefreshProp?: () => Promise<T[]>,
  onLoadMoreProp?: (page: number) => Promise<T[]>,
  tabLabel?: string,
  skeleton?: () => ReactElement
  canCallLoadmore?: boolean
  emptyTitle?: string
  limit?: number
  isAutoFirstLoad?: boolean
  showLoadingWhenReload?: boolean
  hideHeaderWhenEmptyData?: boolean
}

export interface TypedRefBaseListCustom<T> {
  refresh: (config?: { showSkeleton: boolean }) => void
  setList: React.Dispatch<React.SetStateAction<T[]>>
  scrollToTop: () => void
}

const ListBaseComponent = <T,>(props: Props<T>, ref: React.Ref<TypedRefBaseListCustom<T>>) => {
  const {
    scrollIndex,
    onRefreshProp,
    onLoadMoreProp,
    style = {},
    tabLabel,
    skeleton,
    canCallLoadmore = true,
    isAutoFirstLoad = true,
    ListEmptyComponent,
    emptyTitle,
    limit = 20,
    keyExtractor,
    scrollEnabled = true,
    showLoadingWhenReload = false,
    hideHeaderWhenEmptyData,
    ...flatlistProps
  } = props;
  const { theme, styles } = useTheme(createStyles)
  const flatlistRef = useRef<FlatList<T>>(null);
  const canLoadmore = useRef(true);
  const [list, setList] = useState<T[]>([]);
  const [loading, setLoading] = useState(isAutoFirstLoad);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const page = useRef(1)
  const hasScrolled = useRef(false)

  useScrollToTop(flatlistRef);

  useEffect(() => {
    if (loading) {
      onRefresh()
    }
  }, [loading])

  const onRefresh = useCallback(async () => {
    try {
      const res = await onRefreshProp?.();
      setLoading(false);
      if (res) {
        if (res.length < limit) {
          canLoadmore.current = false
        } else {
          canLoadmore.current = true
        }
        setList(res);
        page.current = 1
        return;
      }
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: (config) => {
      if (config?.showSkeleton) {
        setList([])
      }
      setLoading(true);
    },
    setList: setList,
    scrollToTop: () => {
      flatlistRef.current?.scrollToOffset({ offset: 0, animated: false })
    }
  }), [list]);

  const renderFooterComponent = useCallback(() => {
    return (
      <View style={styles.footerLoading}>
        {
          isLoadMore && <ActivityIndicator color={theme.mainColor} size={"large"} />
        }
      </View>
    )
  }, [isLoadMore]);

  const handleLoadMore = useCallback(async () => {
    if (!isLoadMore && hasScrolled.current && canCallLoadmore && canLoadmore.current) {
      try {
        setIsLoadMore(true)
        const res = await onLoadMoreProp?.(page.current + 1);
        if (res && res.length < limit) {
          canLoadmore.current = false
        } else {
          canLoadmore.current = true
        }
        setIsLoadMore(false)
        if (res && res.length > 0) {
          setList(prev => ([...prev, ...res]))
          page.current = page.current + 1
        }
      } catch (error) {
        canLoadmore.current = false
        setIsLoadMore(false)
      }
    }
    hasScrolled.current = false;
  }, [])

  const renderEmptyComponent = useCallback(() => {
    return (
      <View style={styles.viewEmpty}>
        <TextBase title={emptyTitle || "Not found"} fontSize={26} fontWeight="700" style={styles.textTitleEmpty} />
      </View>
    )
  }, [])

  if (loading && skeleton && ((list.length === 0 && !showLoadingWhenReload) || showLoadingWhenReload)) {
    return skeleton()
  }

  return (
    <FlatList
      updateCellsBatchingPeriod={3000}
      windowSize={41}
      initialNumToRender={10}
      maxToRenderPerBatch={6}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      onEndReachedThreshold={2}
      ListHeaderComponent={hideHeaderWhenEmptyData && list.length == 0 ? null : props.ListHeaderComponent}
      ListEmptyComponent={renderEmptyComponent}
      refreshControl={
        scrollEnabled && !flatlistProps.horizontal ?
          <RefreshControl colors={[theme.mainColor]} refreshing={false} onRefresh={onRefresh} />
          : undefined
      }
      bounces={scrollEnabled}
      bouncesZoom={scrollEnabled}
      style={style}
      scrollEventThrottle={16}
      {...flatlistProps}
      ref={flatlistRef}
      data={list}
      // onMomentumScrollBegin={() => Keyboard.dismiss()}
      ListFooterComponent={!loading ? (props.ListFooterComponent || renderFooterComponent) : undefined}
      extraData={list}
      onScrollBeginDrag={() => hasScrolled.current = true}
      onScrollEndDrag={() => hasScrolled.current = true}
      onEndReached={handleLoadMore}
    />
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    footerLoading: {
      height: VS._40,
      justifyContent: "center",
      alignItems: "center",
      width: "100%"
    },
    header: {
      height: VS._40,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: HS._16
    },
    viewEmpty: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: VS._100,
      // width: Device.width - HS._32
    },
    iconEmpty: {
      width: MHS._66,
      height: MHS._66,
      borderRadius: MHS._66,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.mainColor
    },
    textTitleEmpty: {
      textAlign: "center",
      marginVertical: VS._16,
      marginHorizontal: HS._32
    },
  })
}

const ForwardedListBase = forwardRef(ListBaseComponent) as <T>(
  props: Props<T> & { ref?: Ref<TypedRefBaseListCustom<T>> }
) => ReturnType<typeof ListBaseComponent>;

const ListBase = memo(
  ForwardedListBase
) as typeof ForwardedListBase;

// Export the component
export default ListBase;
