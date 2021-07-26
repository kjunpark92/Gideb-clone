import React from 'react'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView as NavSafeAreaView } from 'react-native-safe-area-context'
import { Div, Text, Icon } from 'react-native-magnus'
import { GDHeader } from '../components'

import { useI18n } from '../hooks'
import screens from '../navigation/screens'
import Log from '../util/Log'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface LanguageScreenProps {}

const { useState } = React

const LanguageScreen: React.FC<LanguageScreenProps> = ({}) => {
  const t = useI18n('LanguageChange')
  const insets = useSafeAreaInsets()

  const [selectedLanguage, setSelectedLanguage] = useState('ko')

  return (
    <Div style={{ flex: 1 }} bg="white" pt={insets.top}>
      <GDHeader>{t.title}</GDHeader>
      <Div borderBottomWidth={1} borderBottomColor="gray200" />
      <Div bg="background" px="xl" flex={1} style={{ flexGrow: 1 }}>
        <TouchableOpacity onPress={() => Log.debug('selected language: kor')}>
          <Div mt="2xl" row justifyContent="space-between">
            <Text fontSize="xl">한국어</Text>
            {selectedLanguage == 'ko' ? (
              <Icon
                fontFamily="MaterialCommunityIcons"
                name="check"
                fontSize="4xl"
                color="gray800"
              />
            ) : null}
          </Div>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Log.debug('selected language: eng')}>
          <Div mt="2xl" row justifyContent="space-between">
            <Text fontSize="xl">English</Text>
            {selectedLanguage != 'ko' ? (
              <Icon
                fontFamily="MaterialCommunityIcons"
                name="check"
                fontSize="4xl"
                color="gray800"
              />
            ) : null}
          </Div>
        </TouchableOpacity>
      </Div>
    </Div>
  )
}

export default LanguageScreen
