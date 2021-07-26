import * as React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Div, Text, Icon } from 'react-native-magnus'

import Log from '../util/Log'
import Styles from '../util/Styles'
import { GDHeader } from '../components'
import { WellnessProductBox, GDFontText } from '../components'
import { useI18n } from '../hooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface ProductsScreenProps {
  route: any
}

const { useState, useEffect } = React
const ProductsScreen: React.FC<ProductsScreenProps> = ({ route }) => {
  const [selectedProduct, setSelectedProduct] = useState(0)
  const insets = useSafeAreaInsets()

  const t = useI18n('productsScreen')
  const n = useI18n('wellnessNotes')
  useEffect(() => {
    if (route.params.from == 'wellness') setSelectedProduct(0)
    else setSelectedProduct(1)
    return () => {
      // cleanup
    }
  }, [])

  const { from = 'wellness' } = route?.params?.from ?? 'wellness'

  return (
    <Div flex={1} bg="white" pt={insets.top}>
      <GDHeader>
        {/* {t.title} */}
        {from == 'wellness ' ? '웰니스교육' : '세컨드 윈드'}
      </GDHeader>
      <ScrollView bounces={false}>
        <Div p="lg" bg="background">
          <GDFontText fontSize="3xl" textWeight="700" mt="xl">
            {t.subtitle}
          </GDFontText>
          <Div row alignItems="center" mt="lg" mb="2xl">
            <Icon
              fontFamily="MaterialIcons"
              name="check-circle-outline"
              mr="md"
              fontSize="3xl"
              color="gray500"
            />
            <Text color="gray500" fontSize="lg">
              {n.freeDelivery}
            </Text>
          </Div>

          <TouchableOpacity
            onPress={() => {
              setSelectedProduct(0)
            }}>
            <WellnessProductBox
              buttonDisabled={selectedProduct != 0}
              option={0}
              mode="large"
            />
          </TouchableOpacity>
          <Div mt="lg" />

          <TouchableOpacity
            onPress={() => {
              setSelectedProduct(1)
              Log.debug('selected Item:', selectedProduct)
            }}>
            <WellnessProductBox
              buttonDisabled={selectedProduct != 1}
              option={1}
              mode="large"
            />
          </TouchableOpacity>

          <Div flex={1} row my="xl">
            <Div flex={1}>
              <Icon
                fontFamily="MaterialCommunityIcons"
                name="bell-outline"
                fontSize="4xl"
              />
            </Div>
            <Div flex={9}>
              <Text color="gray500" style={{ flexWrap: 'wrap' }} fontSize="md">
                {n.contactCS}
              </Text>
              <Text
                color="gray500"
                fontSize="md"
                mt="sm"
                textDecorLine="underline"
                textDecorColor="gray500">
                {n.kakaoCSLink}
              </Text>
            </Div>
          </Div>
        </Div>
      </ScrollView>
    </Div>
  )
}

export default ProductsScreen
