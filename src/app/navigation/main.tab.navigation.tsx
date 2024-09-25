import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BOOKING_SCREEN_ROUTE, FAVORITE_SCREEN_ROUTE, HOME_SCREEN_ROUTE } from "app/configs/router.config";
import HomeScreen from "app/screens/home/home.screen";

const Tab = createBottomTabNavigator<BottomTabList>();

import React from 'react';

import BookingScreen from "app/screens/booking/booking.screen";
import FavoriteScreen from "app/screens/favorite/favorite.screen";
import { Shadow7 } from 'app/ui/shadow.ui';
import { VS } from 'app/ui/sizes.ui';
import { StyleSheet } from 'react-native';
import { BottomTabList } from "./type.navigation";

const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName={HOME_SCREEN_ROUTE}
    // tabBar={(props) => {
    //   return <BottomBar {...props} />;
    // }}
    >
      <Tab.Screen
        name={HOME_SCREEN_ROUTE}
        component={HomeScreen}
        options={{
          tabBarLabel: "Home"
        }}
      />
      <Tab.Screen
        name={FAVORITE_SCREEN_ROUTE}
        component={FavoriteScreen}
        options={{
          tabBarLabel: "Favorite"
        }}
      />
      <Tab.Screen
        name={BOOKING_SCREEN_ROUTE}
        component={BookingScreen}
        options={{
          tabBarLabel: "Booking"
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  containerAndroid: {
    zIndex: 11,
    height: VS._60,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Shadow7,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center'
  },
  itemTab: {
    flex: 1,
    alignItems: 'center',
  }
})

export default MainTab