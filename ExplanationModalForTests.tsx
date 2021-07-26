import * as React from 'react'
import { Modal } from 'react-native'
import { Div, Button, Image, Header, Icon, Text } from 'react-native-magnus'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useI18n } from '../hooks'
import Styles from '../util/Styles'
import Log from '../util/Log'
import { GDFontText } from '.'

const TEMP_LANG = {
  iTestExplanationModal: {
    ko: {
      header: 'i테스트',
      questions: '문항',
      bottomGrayText:
        '현재의 마음상태를 알아보는 테스트입니다.\n대답하는데 너무 많이 시간을 들이지 말고 솔직하게 말해주세요.',
      goToText: '출시 -',
      startTest: '시작하기',
    },
  },
}

interface Props {
  visible: boolean
  modalHeader: string
  modalSubtitleAcro: string
  modalQuestionLengthNum: number
  modalDescription: string
  modalRefURL: string
  testTypeSelected?: string
  handleGoingToTest: () => void
  close: () => void
}

const { useEffect } = React
export default function TestExplanationModal({
  visible,
  modalHeader,
  modalSubtitleAcro,
  modalQuestionLengthNum,
  modalDescription,
  modalRefURL,
  testTypeSelected,
  handleGoingToTest,
  close,
}: Props) {
  const t = useI18n('iTestExplanationModal')
  const insets = useSafeAreaInsets()

  useEffect(() => {
    // Log.debug('language =', t)
  }, [])

  return (
    <Modal visible={visible}>
      <Div flex={1} pt={insets.top}>
        {/* added header here for onPress prefix button to close modal instead of navigatin goBack */}
        <Header
          p={16}
          pb="xs"
          shadow="none"
          alignment="center"
          minH={56}
          fontSize="xl"
          borderBottomWidth={1}
          borderBottomColor="gray300"
          prefix={
            <Button bg="transparent" onPress={() => close()}>
              <Icon
                name="arrow-back-ios"
                fontFamily="MaterialIcons"
                fontSize="3xl"
                color="gray900"
              />
            </Button>
          }>
          <GDFontText textWeight="700" fontSize="2xl" letterSpacing={0.5}>
            {t.header}
          </GDFontText>
        </Header>
        <Div p="md" />
        <Div flex={1} ml="sm">
          <Div p="lg">
            <Div
              borderWidth={1}
              borderColor="main900"
              rounded="xl"
              w={59}
              h={27}
              justifyContent="center">
              <Text textAlign="center" color="main900" fontSize={14}>
                {modalQuestionLengthNum + t.questions}
              </Text>
            </Div>
            <Div p="md" />
            <Div mb="xs">
              <GDFontText
                textWeight="700"
                fontSize={Platform.OS == 'android' ? '2xl' : '3xl'}
                lineHeight={26}>
                {modalHeader}
              </GDFontText>
            </Div>
            <Text color="gray500">{modalSubtitleAcro}</Text>
            <Div p="lg" />
            <Div h={168} w={343}>
              <Text
                fontSize={Platform.OS == 'android' ? 12.5 : 13.75}
                lineHeight={Platform.OS == 'android' ? 17 : 22}
                color="gray900">
                {modalDescription}
              </Text>
            </Div>
          </Div>
          <Div p="sm" />
          {Platform.OS != 'android' && <Div p="2xl" />}
          <Div p="3xl" />
          <Div>
            <Text color="gray500" ml="lg">
              {t.bottomGrayText}
            </Text>

            <Div
              borderTopWidth={1.25}
              m="lg"
              row
              py="sm"
              alignItems="center"
              borderColor="gray200">
              <Image
                source={Styles.images.exclamationCircle}
                h={24}
                w={24}
                mr="xs"
              />
              <Text color="gray500">
                {t.goToText}
                {modalRefURL}
              </Text>
            </Div>
          </Div>
        </Div>
      </Div>

      <Div
        pb={Platform.OS == 'android' ? insets.bottom + 10 : insets.bottom}
        position="absolute"
        bottom={0}>
        <Button
          h={48}
          m="sm"
          p="lg"
          bg="main900"
          onPress={handleGoingToTest}
          rounded="circle"
          block>
          <Text fontSize={Platform.OS == 'android' ? 'sm' : 'md'} color="white">
            {t.startTest}
          </Text>
        </Button>
      </Div>
    </Modal>
  )
}
