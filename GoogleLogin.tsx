import * as React from 'react'
import { Div } from 'react-native-magnus'

// google login
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useNavigation } from '@react-navigation/core'

import { GoogleSocialButton } from 'react-native-social-buttons'

// firebase auth
import auth from '@react-native-firebase/auth'
import Log from '../util/Log'

GoogleSignin.configure({
  webClientId:
    '122585161739-ttg2u3nic326ilhr0n4u18bk1muotomt.apps.googleusercontent.com',
})

// const { useState, useEffect, useMemo, useRef, useContext } = React
export default function GoogleLogin() {
  const navigation = useNavigation()

  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const userCredential = await GoogleSignin.signIn()
    // Log.debug('userCredential =', userCredential)
    const {
      idToken,
      user: { email, photo },
    } = userCredential
    // await navigation.navigate(screens.SIGNUP)
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken)
    Log.debug('googleCredential =', googleCredential)
    // setExtraInfoVisible(true)
    // // Sign-in the user with the credential
    try {
      await auth().signInWithCredential(googleCredential)
    } catch (error) {
      Log.error('error =', error)
    }
  }

  return (
    <Div>
      <GoogleSocialButton
        onPress={() =>
          onGoogleButtonPress().then(() => Log.debug('Signed in with Google!'))
        }
      />
    </Div>
  )
}
