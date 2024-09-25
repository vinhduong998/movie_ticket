import { useTheme } from 'app/theme';
import { SystemTheme } from 'app/theme/theme.context';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ListHomeComponent from './component/list.home';
import TrendingHomeComponent from './component/trending.home';

const HomeScreen = () => {
  const { styles } = useTheme(createStyles)
  return (
    <View style={styles.container}>
      <TrendingHomeComponent />
      <ListHomeComponent />
    </View>
  )
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    }
  })
}

export default HomeScreen;