/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import setupAxiosInterceptors from 'app/configs/axios.confg';
import getStore, { persistor } from 'app/configs/store.config';
import AppNavigation from 'app/navigation/app.navigation';
import React from 'react';
import {
  StatusBar,
  StyleSheet
} from 'react-native';


import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const store = getStore()

setupAxiosInterceptors()

function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={"transparent"}
      />
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppNavigation />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
