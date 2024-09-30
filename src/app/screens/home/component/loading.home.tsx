import { useTheme } from 'app/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SystemTheme } from 'app/theme/theme.context';
import { MHS, HS, VS } from 'app/ui/sizes.ui';
import { Device } from 'app/ui/device.ui';
import SkeletonPlaceholder from 'app/component/skeleton/skeleton.placeholder';

const LoadingHome = ({ testID }: { testID?: string }) => {
  const { styles, theme } = useTheme(createStyles)
  return (
    <SkeletonPlaceholder testID={testID}>
      <View style={{ gap: VS._20 }}>
        <View style={{ width: Device.width, height: VS._200 }} />
        <View style={{ paddingHorizontal: HS._16, gap: VS._6 }}>
          <View style={{ width: Device.width - HS._32, height: VS._12 }} />
          <View style={{ width: Device.width - HS._32, height: VS._20 }} />
        </View>
      </View>
      <View style={{ marginTop: VS._20 }}>
        <View style={{ width: Device.width, height: VS._200 }} />
        <View style={{ paddingHorizontal: HS._16, gap: VS._6 }}>
          <View style={{ width: Device.width - HS._32, height: VS._12 }} />
          <View style={{ width: Device.width - HS._32, height: VS._20 }} />
        </View>
      </View>
    </SkeletonPlaceholder>
  )
}

const createStyles = (theme: SystemTheme) => {
  return StyleSheet.create({
    container: {
      gap: VS._20
    }
  })
}

export default LoadingHome;