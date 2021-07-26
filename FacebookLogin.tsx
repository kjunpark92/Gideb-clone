import React from 'react'
import { View } from 'react-native'

// facebook login
import { LoginManager, AccessToken } from 'react-native-fbsdk'

import { FacebookSocialButton } from 'react-native-social-buttons'

// firebase auth
import auth from '@react-native-firebase/auth'
import Log from '../util/Log'

export default function FacebookLogin() {
  const onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ])
    if (result.isCancelled) {
      throw 'User cancelled the login process'
    }
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken()
    if (!data) {
      throw 'Something went wrong obtaining access token'
    }
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    )
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential)
  }
  return (
    <View>
      <FacebookSocialButton
        onPress={() =>
          onFacebookButtonPress().then(() =>
            Log.info('Signed in with Facebook!'),
          )
        }
        buttonViewStyle={{}}
        logoStyle={{}}
        textStyle={{}}
      />
    </View>
  )
}
