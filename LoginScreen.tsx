import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Div, Input, Text, WINDOW_HEIGHT } from 'react-native-magnus'
import { useFirebase } from 'react-redux-firebase'
import Log from '../util/Log'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

// react-navigation
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation'

import Styles from '../util/Styles'

import { InputWithTitle, LoginIconText, GDFontText } from '../components'
import Config from '../config'
import { ScrollView } from 'react-native-gesture-handler'
import GDUtil from '../util/GDUtil'
import AppleLogin from '../components/AppleLogin'
import GoogleLogin from '../components/GoogleLogin'
import FacebookLogin from '../components/FacebookLogin'
import screens from '../navigation/screens'
import { useI18n } from '../hooks'
import { RouteProp, useRoute } from '@react-navigation/core'
import RootStackParamList from '../navigation/RootStackParamList'
import { UserTypeContext } from '../context/UserTypeContext'
import Toast from 'react-native-toast-message'
import GDHeader from '../components/GDHeader'

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>

const LoginScreen: React.FC = ({ navigation }: Props) => {
  const route = useRoute<LoginScreenRouteProp>()
  const { userType } = useContext(UserTypeContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [onLogin, setOnLogin] = useState(false)
  const [validity, setValidity] = useState({
    emailValidity: false,
    passwordValidity: false,
  })
  const [socialPressed, setSocialPressed] = useState(false)

  const insets = useSafeAreaInsets()

  const t = useI18n('login')
  const firebase = useFirebase()
  const profile = useSelector((state: any) => state.firebase.profile)

  useEffect(() => {
    setValidity({
      emailValidity: GDUtil.validEmail(email),
      passwordValidity: GDUtil.validPassword(password),
    })

    return () => {
      // cleanup
    }
  }, [email, password])

  useEffect(() => {
    Log.debug('profile changed: profile =', profile)
    if (!profile.isEmpty) navigation.navigate(screens.SOCIAL_LOGIN_EXTRA_INFO)
    return () => {
      // cleanup
    }
  }, [profile])

  const doLogin = async () => {
    try {
      setOnLogin(true)
      const user = await firebase.login({ email, password })
      Log.debug('LoginScreen: user:', user)
    } catch (error) {
      Log.error('LoginScreen: doLogin: error', error)
      Toast.show({
        type: 'error',
        text1: t.authError.title,
        text2: t.authError[error.code],
      })
    } finally {
      setOnLogin(false)
    }
  }

  return (
    <Div style={styles.container} pt={insets.top}>
      <ScrollView
        bounces={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        <GDHeader p={0} />
        {/* change image back to orignal ( green and blue) */}
        <LoginIconText mainText={t.greet[userType]} />
        <Div mx="xl">
          {/* take out header with inputs // add place holders instead .... */}
          {/* inputs widths must be longer in login screen */}
          <InputWithTitle
            validity={validity.emailValidity}
            title={t.email}
            placeholder={t.emailPlaceholder}
            focusBorderColor={Styles.colors.client.purple}
            onChangeText={(t) => setEmail(t)}
            keyboardType="email-address"
            autoCapitalize="none"
            mb="xl"
          />
          {/* vertical padding must be shortened between input fields and buttons */}
          <InputWithTitle
            validity={validity.passwordValidity}
            title={t.password}
            placeholder={t.passwordPlaceholder}
            focusBorderColor={Styles.colors.client.purple}
            icon="eye"
            iconColor={Styles.colors.grayscale.darkGray}
            iconSize="xl"
            onChangeText={(t) => setPassword(t)}
            secureTextEntry
            mb="xl"
          />
          <Button
            block
            bg="main900"
            disabled={!(validity.emailValidity && validity.passwordValidity)}
            onPress={doLogin}
            rounded="circle"
            loading={onLogin}>
            {t.login}
          </Button>

          {/* forgot email or password */}
          <Div
            row
            justifyContent="space-around"
            alignItems="center"
            px="xl"
            mt="sm">
            <Button
              bg="white"
              color={Styles.colors.text.dark}
              onPress={() => navigation.navigate(screens.FORGOT_EMAIL)}>
              {t.forgotEmail}
            </Button>
            <Div h={20} borderRightWidth={1} />
            <Button
              bg="white"
              color={Styles.colors.text.dark}
              onPress={() => navigation.navigate(screens.FORGOT_PASSWORD)}>
              {t.forgotPassword}
            </Button>
          </Div>

          {/* sign up */}
          <Div row justifyContent="center" alignItems="center">
            <Text fontSize="md" color="gray800">
              {t.signupMessage}
            </Text>
            <Button
              bg="white"
              fontSize="md"
              fontWeight="600"
              color={Styles.colors.text.dark}
              onPress={() => navigation.navigate(screens.SIGNUP)}>
              {t.signup}
            </Button>
          </Div>

          {/* Social logins */}
          {userType === 'client' ? (
            <Div alignItems="center" mt="xl">
              <FacebookLogin />
              <GoogleLogin />
              <AppleLogin />
            </Div>
          ) : null}
        </Div>
      </ScrollView>
    </Div>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: Styles.colors.background.light,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    height: WINDOW_HEIGHT * 1.2,
  },
  googleButton: {
    width: '90%',
  },
  appleButton: {
    width: '50%',
    height: 48,
  },
  header: {
    margin: 10,
    marginTop: 30,
    fontSize: 18,
    fontWeight: '600',
  },
  horizontal: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
})
export default LoginScreen
