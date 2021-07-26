import React from 'react'
import { Div, Image, Text } from 'react-native-magnus'

import Styles from '../util/Styles'
import { useI18n } from '../hooks'
import { GDFontText } from '.'

export default function SecondWindItemBox<SecondWindItemBoxProps>(props: any) {
  const t = useI18n('secondWindItemBox')

  return (
    <Div row px="lg" py="xl" mt="lg" bg="gray100" rounded="2xl">
      <Div flex={2}>
        <GDFontText fontSize="2xl">{t.title}</GDFontText>

        <GDFontText mt="lg" fontSize="xl">
          {t.text1}
        </GDFontText>
        <Text color="gray500" ml="lg">
          {t.price}
        </Text>
        <GDFontText mt="xl" fontSize="xl">
          {t.text2}
        </GDFontText>
      </Div>
      <Div flex={1.3}>
        <Image
          source={Styles.images.secondwind.smallBandPic}
          resizeMode="contain"
          h={127}
          w={120}
          mt="lg"
        />
      </Div>
    </Div>
  )
}
