import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DETAIL_MOVIE_SCREEN_ROUTE, NAVIGATION_TAB } from 'app/configs/router.config';
import { navigationRef } from 'app/helpers/navigation.helper';
import DetailMovieScreen from 'app/screens/detail/detail.movie.screen';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import MainTab from './main.tab.navigation';
import { RootStackList } from './type.navigation';


const NativeStack = createNativeStackNavigator<RootStackList>();

const AppNavigation = () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}
        onReady={() => {
          // dismiss splash screen here
        }}
        onStateChange={() => {
          // log to analytics
        }}
      >
        <StatusBar barStyle={"dark-content"} translucent={true} backgroundColor={"transparent"} />
        <NativeStack.Navigator
          screenOptions={{
            animation: "slide_from_right",
            headerBackTitleVisible: false,
            headerShown: false
          }}
        >

          <NativeStack.Screen
            name={NAVIGATION_TAB}
            component={MainTab}
          />
          <NativeStack.Screen
            options={{
              headerShown: true
            }}
            name={DETAIL_MOVIE_SCREEN_ROUTE}
            component={DetailMovieScreen}
          />
        </NativeStack.Navigator>
      </NavigationContainer>
    </View>
  )
}

const styles = StyleSheet.create({

})

export default AppNavigation;