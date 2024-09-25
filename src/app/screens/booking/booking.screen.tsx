import { useTheme } from 'app/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SystemTheme } from 'app/theme/theme.context';
import { MHS, HS, VS } from 'app/ui/sizes.ui';

const BookingScreen = () => {
  const { styles, theme } = useTheme(createStyles)
  return (
    <View style={styles.container}>
      
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

export default BookingScreen;