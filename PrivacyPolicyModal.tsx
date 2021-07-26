import * as React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Div, Icon, Text, Modal } from 'react-native-magnus'
import { useI18n } from '../hooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import GDFontText from './GDFontText'

const PrivacyPolicyModal = (props) => {
  const t = useI18n('privacyPolicy')
  const insets = useSafeAreaInsets()
  return (
    <Modal roundedTop="2xl" h="90%" pt={insets.top} isVisible={props.isVisible}>
      <Div alignSelf="flex-end">
        <TouchableOpacity onPress={props.closeFunc}>
          <Icon
            fontFamily="MaterialCommunityIcons"
            name="close"
            fontSize="4xl"
            color="black"
            p="lg"
          />
        </TouchableOpacity>
      </Div>
      <Div alignSelf="center" mb="xl">
        <GDFontText fontSize="xl" textWeight="700">
          {t.title}
        </GDFontText>
      </Div>
      <ScrollView>
        <Div flex={1}>
          <Text fontSize="lg" px="lg">
            {t.text}
          </Text>
          <Div mt="2xl" />
        </Div>
      </ScrollView>
    </Modal>
  )
}
// export default forwardRef(PrivacyPolicyModal)
export default PrivacyPolicyModal
