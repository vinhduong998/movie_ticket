import { useTheme } from 'app/theme';
import { SystemTheme } from 'app/theme/theme.context';
import React, { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import ListHomeComponent from './component/list.home';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { styles } = useTheme(createStyles)
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Home"
    })
  }, [])

  return (
    <View testID='home' style={styles.container}>
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