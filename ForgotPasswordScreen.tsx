import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Div, Text, Button } from 'react-native-magnus'
import { SafeAreaView } from 'react-native-safe-area-context'
import InputWithTitle from '../components/InputWithTitle'
import { useI18n } from '../hooks'
import Styles from '../util/Styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import UserService from '../services/user'
import Log from '../util/Log'
import GDHeader from '../components/GDHeader'
import { useFirebase } from 'react-redux-firebase'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const t = useI18n('forgotPassword')
  const firebase = useFirebase()

  const handleForgotPassword = async () => {
    try {
      setLoading(true)
      await firebase.auth().sendPasswordResetEmail(email)
      Log.debug('password reset mail sent')
      setMessage(t.sendingSuccessMessage)
    } catch (error) {
      Log.error('failed to sent password reset email = ', error)
      setMessage(t.sendingFailMessage)
    } finally {
      setLoading(false)
    }
  }

  const insets = useSafeAreaInsets()

  return (
    <Div style={styles.container} pt={insets.top}>
      <Div>
        <GDHeader>{t.title}</GDHeader>
        <Div mx="xl" mt="2xl">
          <InputWithTitle
            title={t.email}
            placeholder={t.emailPlaceholder}
            focusBorderColor={Styles.colors.client.purple}
            onChangeText={(t) => setEmail(t)}
            keyboardType="email-address"
            autoCapitalize="none"
            mb="xl"
          />
          <Button
            rounded="circle"
            block
            onPress={handleForgotPassword}
            loading={loading}
            bg="main900">
            {t.buttonTitle}
          </Button>
        </Div>
        <Text fontSize="xl" color="gray600" textAlign="center" m="xl">
          {message}
        </Text>
      </Div>
    </Div>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Styles.colors.background.light,
  },
})
