import * as React from 'react'
import { StyleSheet, ScrollView, Platform } from 'react-native'
import { Div, Text, Button, Image } from 'react-native-magnus'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Styles from '../util/Styles'
import screens from '../navigation/screens'
import { GDHeader, SecondWindItemBox, GDFontText } from '../components'
import { useI18n } from '../hooks'

interface SecondWindInitialScreenProps {
  navigation: any
}

// NEED TO PUT DETILS SCREEN HERE LIKE WE DID IN WELLNESS TRAINING *****
// WITH STICKHEADERINDICES for the radio selectors
const SecondWindInitialScreen: React.FC<SecondWindInitialScreenProps> = ({
  navigation,
}) => {
  const t = useI18n('secondwindInitialScreen')
  const handleGoToDetails = () =>
    navigation.navigate(screens.SECONDWIND_DETAILS)

  const insets = useSafeAreaInsets()

  return (
    <>
      <Div flex={1} bg="white" pt={insets.top}>
        <GDHeader>{t.title}</GDHeader>
        <ScrollView bounces={false}>
          <Div bg="background" pb="2xl">
            <Div row bg="gray150" h={214} flex={1}>
              <Div flex={1} justifyContent="center">
                <Text fontSize="md" color="main900" ml="lg">
                  {'건강한 나를 찾는 시간'}
                </Text>
                <Div p="xs" />
                <Text fontWeight="bold" fontSize="3xl" ml="lg">
                  {'건강관리 솔루션\n세컨드 윈드'}
                </Text>
              </Div>
              <Div ml="2xl" mt="2xl" flex={1}>
                <Div
                  bg="white"
                  overflow="visible"
                  rounded="circle"
                  w={155}
                  h={155}
                  alignItems="center"
                  justifyContent="center">
                  <Image
                    resizeMode="contain"
                    source={Styles.images.secondwind.secondWindSmile}
                    h={152}
                    w={105}
                    bottom={8}
                  />
                </Div>
              </Div>
            </Div>
            <Div px="xl">
              <Div mt="2xl" row justifyContent="space-between">
                <GDFontText fontSize="3xl">{t.itemName}</GDFontText>
                <GDFontText fontSize="3xl">{t.discountPrice}</GDFontText>
              </Div>
              <Div alignSelf="flex-end">
                <Text
                  textDecorLine="line-through"
                  color="gray500"
                  fontSize="lg">
                  {t.price}
                </Text>
              </Div>

              <Text mt="2xl" mb="md" fontSize="lg">
                {t.paragraph}
              </Text>

              <SecondWindItemBox />
            </Div>
          </Div>
          <Div p="3xl" />
        </ScrollView>

        {Platform.OS == 'android' ? (
          <Div position="absolute" bottom={0}>
            <Button
              h={48}
              block
              rounded="none"
              onPress={handleGoToDetails}
              py="xl"
              bg="main900">
              {t.goToNextButton}
            </Button>
          </Div>
        ) : (
          <Div
            position="absolute"
            bottom={0}
            pb={insets.bottom}
            bg="white"
            p="md">
            <Button
              // h={64}
              h={48}
              block
              rounded="circle"
              onPress={handleGoToDetails}
              // py="xl"
              bg="main900"
              fontSize="lg">
              {t.goToNextButton}
            </Button>
          </Div>
        )}
      </Div>
    </>
  )
}

const styles = StyleSheet.create({})

export default SecondWindInitialScreen
