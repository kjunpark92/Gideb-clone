import * as React from 'react'
import { Div, Text, Button, Image } from 'react-native-magnus'
import Log from '../util/Log'
import Styles from '../util/Styles'
import screens from '../navigation/screens'
import { useNavigation } from '@react-navigation/native'
import { useI18n } from '../hooks'
import { GDFontText } from '../components'

const { useState } = React

interface WellnessProductBoxProps {
  buttonDisabled: boolean
  option: number
  mode: string
}

const WellnessProductBox: React.FC<WellnessProductBoxProps> = ({
  buttonDisabled,
  option,
  mode,
}) => {
  const t = useI18n('wellnessProductBox')
  const [currentProduct, setCurrentProduct] = useState(t.items[option])

  const navigation = useNavigation()
  const pressHandler = () => {
    navigation.navigate(screens.PAYMENT_INFO, { option })
  }

  return (
    <Div
      borderWidth={3}
      borderColor={!buttonDisabled ? 'main900' : 'background'}
      rounded="2xl"
      py="xl"
      px="xl"
      bg={!buttonDisabled ? 'rgba(79, 209, 197, 0.1)' : 'gray100'}>
      <Div row my="md">
        {currentProduct.descriptionBoxes.map((description, i) => (
          <Div
            bg="system900"
            mr="md"
            p="sm"
            px="lg"
            rounded="2xl"
            key={String(i)}>
            <Text color="white" textAlign="center" fontSize="md">
              {description}
            </Text>
          </Div>
        ))}
      </Div>

      {option === 0 ? (
        <>
          <Div alignItems="flex-start">
            <Div>
              <GDFontText fontSize="3xl">
                {currentProduct.headerText}
              </GDFontText>
            </Div>
            <Div>
              <Text fontSize="lg" color="gray500">
                {t.programLength}
              </Text>
            </Div>
          </Div>

          <Div
            row
            justifyContent="space-between"
            alignItems="center"
            pb="lg"
            mt="sm">
            <Div flex={1} mb="xl">
              <Text fontSize="lg">{t.point1}</Text>
              <Text pl="lg" fontSize="md" color="gray500">
                {t.point1Details}
              </Text>
              <Text fontSize="lg" mt="lg">
                {t.point2}
              </Text>
            </Div>
            <Div flex={1}>
              <Image
                source={Styles.images.secondwind.awh}
                resizeMode="contain"
                h={133.1}
                w={181.5}
              />
            </Div>
          </Div>

          <Div row justifyContent="space-between" alignItems="center" my="lg">
            <Div flex={1}>
              <GDFontText fontSize="3xl">{currentProduct.discount}</GDFontText>
            </Div>
            <Div flex={4} justifyContent="flex-end" row alignItems="center">
              <Text color="gray400" textDecorLine="line-through" fontSize="lg">
                {currentProduct.price}
              </Text>
              <GDFontText fontSize="3xl" px="md">
                {currentProduct.discountPrice}
              </GDFontText>
            </Div>
          </Div>
        </>
      ) : (
        option === 1 && (
          <>
            <Div row pb="lg">
              <Div alignItems="flex-start">
                <GDFontText fontSize="3xl">
                  {currentProduct.headerText}
                </GDFontText>

                <Div flex={1} my="xl">
                  <Text fontSize="lg">{t.point1}</Text>
                  <Text pl="lg" fontSize="md" color="gray500">
                    {t.point1Details}
                  </Text>
                  <Text fontSize="lg" my="lg">
                    {t.point2}
                  </Text>
                </Div>
              </Div>
              <Div flex={1} alignItems="flex-end" justifyContent="flex-end">
                <Image
                  source={Styles.images.secondwind.watch}
                  resizeMode="contain"
                  h={157.2153}
                  w={169.4}
                />
              </Div>
            </Div>

            <Div row justifyContent="space-between" alignItems="center" my="lg">
              <Div flex={1}>
                <GDFontText fontSize="3xl">
                  {currentProduct.discount}
                </GDFontText>
              </Div>
              <Div flex={4} justifyContent="flex-end" row alignItems="center">
                <Text
                  color="gray400"
                  textDecorLine="line-through"
                  fontSize="lg">
                  {currentProduct.price}
                </Text>
                <GDFontText fontSize="3xl" px="md">
                  {currentProduct.discountPrice}
                </GDFontText>
              </Div>
            </Div>
          </>
        )
      )}

      {mode == 'large' && (
        <Div
          borderTopColor={Styles.colors.grayscale.lightGray}
          borderTopWidth={1}
          mt="lg">
          <Button
            onPress={pressHandler}
            disabled={buttonDisabled}
            rounded="circle"
            block
            py={17}
            mt="xl"
            bg="main900">
            <GDFontText color="white" fontSize="lg">
              {t.btn}
            </GDFontText>
          </Button>
        </Div>
      )}
    </Div>
  )
}

export default WellnessProductBox
