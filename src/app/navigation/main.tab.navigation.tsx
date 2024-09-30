import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BOOKING_SCREEN_ROUTE, FAVORITE_SCREEN_ROUTE, HOME_SCREEN_ROUTE } from "app/configs/router.config";
import HomeScreen from "app/screens/home/home.screen";

const Tab = createBottomTabNavigator<BottomTabList>();

import React from 'react';

import TextBase from "app/component/core/TextBase";
import BookingScreen from "app/screens/booking/booking.screen";
import FavoriteScreen from "app/screens/favorite/favorite.screen";
import { useTheme } from "app/theme";
import { SystemTheme } from "app/theme/theme.context";
import { Shadow7 } from 'app/ui/shadow.ui';
import { HIT_SLOP_EXPAND_20, VS } from 'app/ui/sizes.ui';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomTabList } from "./type.navigation";

const BottomBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { theme, styles } = useTheme(createStyles)


  return (
    <View style={styles.containerAndroid}>
      <View style={styles.tabBarView}>
        {
          state.routes.map((route, id) => {
            const { options } = descriptors[route.key];
            const isActive = state.index === id;
            const label = options.title !== undefined
              ? options.title
              : route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isActive && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }

            return (
              <TouchableOpacity
                key={id}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={isActive ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.itemTab}
                hitSlop={HIT_SLOP_EXPAND_20}
              >
                <TextBase title={label} color={isActive ? theme.mainColor : `${String(theme.text)}80`} fontWeight='600' fontSize={16} />
              </TouchableOpacity>
            );
          })
        }
      </View>
    </View>
  )
}

const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarIconStyle: { display: "none" },
      }}
      initialRouteName={HOME_SCREEN_ROUTE}
      tabBar={(props) => {
        return <BottomBar {...props} />;
      }}
    >
      <Tab.Screen
        name={HOME_SCREEN_ROUTE}
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarTestID: "home-bottombar"
        }}
      />
      <Tab.Screen
        name={FAVORITE_SCREEN_ROUTE}
        component={FavoriteScreen}
        options={{
          title: "Favorite",
          tabBarTestID: "favorite-bottombar"
        }}
      />
      <Tab.Screen
        name={BOOKING_SCREEN_ROUTE}
        component={BookingScreen}
        options={{
          title: "Booking",
          tabBarTestID: "booking-bottombar"
        }}
      />
    </Tab.Navigator>
  );
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    containerAndroid: {
      height: VS._60,
      ...Shadow7,
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: 'center',
      backgroundColor: theme.background
    },
    itemTab: {
      flex: 1,
      alignItems: 'center',
    },
    tabBarView: {
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: 'center',
      backgroundColor: "transparent",
      width: "100%"
    },
  })
}

export default MainTab