/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import TextBase from 'app/component/core/TextBase';
import setupAxiosInterceptors from 'app/configs/axios.confg';
import getStore, { persistor } from 'app/configs/store.config';
import { createDB } from 'app/helpers/sqlite.helper';
import AppNavigation from 'app/navigation/app.navigation';
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View
} from 'react-native';


import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const store = getStore()

setupAxiosInterceptors()

function App() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    // setup database local
    createDB().then(() => {
      setLoading(false)
    }).catch((error) => {
      console.warn(error)
    })
  }, [])


  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={"transparent"}
      />
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {
              !loading ? <AppNavigation /> : (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <TextBase title={"Loading for database local..."} />
                  <TextBase title={"(Can be intro screen)"} />
                </View>
              )
            }
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
