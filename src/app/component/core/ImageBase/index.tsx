import { CACHE_MEDIA_HOME_FOLDER, getMediaCachePath } from 'app/helpers/file.helper';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageProps, Image, ImageURISource, ImageRequireSource } from 'react-native';
import Animated from 'react-native-reanimated';

interface ImageUri extends ImageURISource {
  uri: string
}

interface Props extends ImageProps {
  round?: number;
  source: ImageUri;
  cache?: boolean;
  thumbUrl?: string;
  sharedTag?: boolean
}

const ImageBase = ({ round = 0, source, cache = false, thumbUrl, sharedTag, ...props }: Props) => {
  const [loading, setLoading] = useState(true)
  const [uri, setUri] = useState("")

  useEffect(() => {
    const getPath = async () => {
      if (!source.uri) {
        return
      }
      if (!cache || thumbUrl) {
        // no cache or have thumbnail
        setUri(thumbUrl || source.uri)
        setLoading(false)
        return
      }
      const path = await getMediaCachePath(source.uri, CACHE_MEDIA_HOME_FOLDER)
      setUri(path)
      setLoading(false)
    }
    getPath()
  }, [])

  const renderContent = () => {
    if (loading) {
      return (
        <Image
          source={require("app/assets/images/loading.jpg")}
          {...props}
        />
      )
    }
    return (
      <Image
        source={{ ...source, uri: uri }}
        resizeMode="cover"
        {...props}
      />
    )
  }

  if (!source.uri) {
    return (
      <View style={{ borderRadius: round, overflow: "hidden" }}>
        <Image
          source={require("app/assets/images/loading.jpg")}
          {...props}
        />
      </View>
    )
  }

  if (sharedTag) {
    return (
      <Animated.View sharedTransitionTag={source.uri} style={{ borderRadius: round, overflow: "hidden" }}>
        {renderContent()}
      </Animated.View>
    )
  }

  return (
    <View style={{ borderRadius: round, overflow: "hidden" }}>
      {renderContent()}
    </View>
  )
};

export default ImageBase;