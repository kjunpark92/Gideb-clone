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
import GDUtil from '../util/GDUtil'

export default function ForgotEmailScreen() {
  const [phoneNo, setPhoneNo] = useState('')
  const [emailsFound, setEmailsFound] = useState(null)
  const [loading, setLoading] = useState(false)
  const t = useI18n('forgotEmail')

  const handleFindEmail = async () => {
    try {
      const e164Number = GDUtil.mobilePhoneNoToE164(phoneNo)
      setLoading(true)
      const { emails } = await UserService.findEmailByPhoneNo(e164Number)
      Log.debug('email found = ', emails)
      setEmailsFound(emails)
    } catch (error) {
      Log.error('failed to find email = ', error)
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
            title={t.phone}
            placeholder={t.phonePlaceholder}
            focusBorderColor={Styles.colors.client.purple}
            onChangeText={(t) =>
              setPhoneNo(GDUtil.transformMobilePhoneToDashedForm(t))
            }
            value={phoneNo}
            keyboardType="phone-pad"
            autoCapitalize="none"
            mb="xl"
          />
          <Button
            block
            rounded="circle"
            onPress={handleFindEmail}
            loading={loading}
            bg="main900">
            {t.buttonTitle}
          </Button>
        </Div>
        {emailsFound === null ? null : emailsFound?.length > 0 ? (
          <Div m="xl" justifyContent="center" alignItems="center">
            <Text fontSize="xl" color="gray600">
              {t.foundedEmailsTitle}
            </Text>
            {emailsFound?.map((email) => (
              <Text color="gray800" fontSize="3xl" key={email}>
                {email}
              </Text>
            ))}
          </Div>
        ) : (
          <Text fontSize="xl" color="gray600" textAlign="center" m="xl">
            {t.notfound}
          </Text>
        )}
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
