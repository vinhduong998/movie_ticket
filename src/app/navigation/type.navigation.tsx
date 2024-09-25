import { BOOKING_SCREEN_ROUTE, DETAIL_MOVIE_SCREEN_ROUTE, FAVORITE_SCREEN_ROUTE, HOME_SCREEN_ROUTE, NAVIGATION_TAB } from "app/configs/router.config";

export type RootStackList = {
  [NAVIGATION_TAB]: undefined
  [DETAIL_MOVIE_SCREEN_ROUTE]: { movie: TMovie }
};

export type BottomTabList = {
  [HOME_SCREEN_ROUTE]: undefined
  [FAVORITE_SCREEN_ROUTE]: undefined
  [BOOKING_SCREEN_ROUTE]: undefined
};
