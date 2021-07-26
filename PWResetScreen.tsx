import React from 'react'
import { Alert } from 'react-native'
import { SafeAreaView as NavSafeAreaView } from 'react-native-safe-area-context'
import { Button, Div, Text, Input } from 'react-native-magnus'
import { GDHeader } from '../components'
import { useFirebase } from 'react-redux-firebase'
import { useI18n } from '../hooks'
import screens from '../navigation/screens'
import Log from '../util/Log'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface PWResetScreenProps {}

import { useSelector } from 'react-redux'
const { useState } = React

const PWResetScreen: React.FC<PWResetScreenProps> = ({}) => {
  const t = useI18n('PWReset')
  const insets = useSafeAreaInsets()

  const [hasValidEmail, setHasValidEmail] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const onPressHandler = () => {
    if (profile.email == email) {
      Log.debug('pw change fired -- valid PW')
      passwordReset()
    } else {
      Alert.alert(t.failBoxTitle, t.failBoxMsg, [
        {
          text: t.failBoxButton,
          onPress: () => Log.debug('failBox Ok pressed'),
        },
      ])
      Log.debug('pw change fired -- invalid PW')
    }
  }

  const profile = useSelector((state: any) => state.firebase.profile)
  const firebase = useFirebase()

  const passwordReset = async () => {
    Log.debug('pwreset fired: ', email)
    try {
      await firebase.auth().sendPasswordResetEmail(email)
      setEmail('')
      setShowSuccess(true)
    } catch (error) {}
  }
  const enterEmailHandler = (input) => {
    Log.debug(
      'enterEmailHandler: checked valid:',
      input == profile.email,
      profile.email,
      input,
    )
    setEmail(input)
    if (input == profile.email) {
      setHasValidEmail(true)
      Log.debug('enterEmailHandler: valid email')
    } else {
      Log.debug('enterEmailHandler: email NOT valid')
    }
  }

  return (
    <Div style={{ flex: 1 }} bg="white" pt={insets.top}>
      <GDHeader>{t.title}</GDHeader>
      <Div borderBottomWidth={1} borderBottomColor="gray200" />
      <Div bg="background" px="xl" flex={1} style={{ flexGrow: 1 }}>
        {!showSuccess ? (
          <>
            <Input
              mt="2xl"
              placeholder={t.inputPlaceholder}
              focusBorderColor="gray800"
              value={email}
              fontSize="lg"
              py={17}
              onChangeText={(input) => enterEmailHandler(input)}
            />
            <Button
              onPress={() => onPressHandler()}
              block
              mt="2xl"
              py={17}
              rounded="circle"
              bg="main900"
              fontSize="lg"
              color={
                hasValidEmail ? 'background' : 'rgba(255, 255, 255, 0.35)'
              }>
              {t.button}
            </Button>
          </>
        ) : (
          <Div mt="2xl" alignItems="center">
            <Text textAlign="center" fontSize="xl" mt="2xl" pt="2xl">
              {t.successMsg}
            </Text>
          </Div>
        )}
      </Div>
    </Div>
  )
}

export default PWResetScreen
