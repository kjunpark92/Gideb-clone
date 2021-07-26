import * as React from 'react'
import { Div, Image, Text, Button } from 'react-native-magnus'
import { ImageSourcePropType, TouchableOpacity } from 'react-native'

import Styles from '../util/Styles'

interface ClientNavTilesProps {
  screenName: string
  picture: ImageSourcePropType
  iconSize: { h: number; w: number }
  onPress: () => void
}

const ClientNavTiles: React.FC<ClientNavTilesProps> = ({
  screenName,
  picture,
  iconSize = { h: 65, w: 65 },
  onPress,
}) => (
  <Button
    onPress={onPress}
    h={144}
    w={'48%'}
    bg="white"
    mb={10}
    justifyContent="center"
    alignItems="center"
    textAlign="center"
    rounded={16}
    shadow="lg"
    shadowColor="rgba(0, 0, 0, 0.25)">
    <Div flex={1}>
      <Image
        source={picture}
        alignSelf="center"
        bottom={0}
        resizeMode="contain"
        h={iconSize.h}
        w={iconSize.w}
        mb={8}
      />

      <Text fontSize={14} lineHeight={20} textAlign="center" color="gray600">
        {screenName}
      </Text>
    </Div>
  </Button>
)

export default ClientNavTiles
