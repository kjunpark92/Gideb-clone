import * as React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Div, Text, Icon, Dropdown, Modal } from 'react-native-magnus'
import Log from '../util/Log'
const { useState, useRef } = React
import { useI18n } from '../hooks'
import { inlineStyles } from 'react-native-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import GDFontText from './GDFontText'
interface RefundProps {
  showHeader: boolean
}

const Refund: React.FC<RefundProps> = ({ showHeader }) => {
  const t = useI18n('refund')
  const insets = useSafeAreaInsets()
  const [showRefundModal, setShowRefundModal] = useState(false)

  const refundRef = useRef(null)

  const toggleRefundModal = () => {
    Log.debug('toggle modal fired')
    setShowRefundModal(!showRefundModal)
  }
  return (
    <>
      <Modal
        isVisible={showRefundModal}
        roundedTop="2xl"
        h="90%"
        pt={insets.top}>
        <Div alignSelf="flex-end">
          <TouchableOpacity onPress={() => setShowRefundModal(false)}>
            <Icon
              fontFamily="MaterialCommunityIcons"
              name="close"
              fontSize="4xl"
              color="black"
              p="lg"
            />
          </TouchableOpacity>
        </Div>
        <Div alignSelf="center" pl="lg" pb="2xl">
          <GDFontText fontSize="3xl">{t.title}</GDFontText>
        </Div>
        <Div px="lg" pb="2xl">
          <ScrollView>
            <Div flex={1} mb="2xl">
              <Text fontSize="lg" mb="2xl">
                {t.paragraph}
              </Text>
            </Div>
          </ScrollView>
        </Div>
      </Modal>
      <Div>
        {showHeader && (
          <Div>
            <GDFontText fontSize="3xl" pl="lg" textWeight="700">
              {t.header}
            </GDFontText>
          </Div>
        )}
        <Div bg="gray150" rounded="2xl" p="xl" mx="lg" mt="xl">
          <GDFontText fontSize="md" textWeight="700">
            {t.details}
          </GDFontText>
          <Div row mt="2xl">
            <TouchableOpacity
              onPress={() => setShowRefundModal(true)}
              style={{ flexDirection: 'row' }}>
              <Text pr="xs" fontSize="md">
                {t.modalLink}
              </Text>
              <Icon
                fontFamily="Entypo"
                name="chevron-right"
                color="dark"
                fontSize="2xl"
              />
            </TouchableOpacity>
          </Div>
        </Div>
      </Div>
    </>
  )
}

export default Refund
