import React from 'react'
import { View, StyleSheet } from 'react-native'

import { AppleSocialButton } from 'react-native-social-buttons'

// apple login
import { appleAuth } from '@invertase/react-native-apple-authentication'

// firebase auth
import auth from '@react-native-firebase/auth'
import Log from '../util/Log'
import Styles from '../util/Styles'

export default function AppleLogin() {
  const onAppleButtonPress = async () => {
    // Log.debug('start of action')
    // Log.debug('appAuth.Operation.LOGIN =', appleAuth)
    try {
      // 1). start a apple sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      Log.debug('appleAuthRequestResponse =', appleAuthRequestResponse)

      // 2). if the request was successful, extract the token and nonce
      const { identityToken, nonce } = appleAuthRequestResponse

      // can be null in some scenarios
      if (identityToken) {
        // 3). create a Firebase `AppleAuthProvider` credential
        const appleCredential = auth.AppleAuthProvider.credential(
          identityToken,
          nonce,
        )

        // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
        //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
        //     to link the account to an existing user
        const userCredential = await auth().signInWithCredential(
          appleCredential,
        )

        // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
        Log.debug(
          `Firebase authenticated via Apple, UID: ${userCredential.user.uid}`,
        )
      } else {
        // handle this - retry?
      }
    } catch (error) {
      Log.error('onAppleButtonPress: error =', error)
    }
  }

  return (
    <View>
      {appleAuth.isSupported ? (
        <AppleSocialButton
          buttonViewStyle={styles.button}
          // style={styles.appleButton}
          // cornerRadius={5}
          // buttonStyle={AppleButton.Style.BLACK}
          // buttonType={AppleButton.Type.CONTINUE}
          onPress={() => onAppleButtonPress()}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: Styles.colors.grayscale.blackGray,
    borderRadius: 25,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
  },
})

// props for use:
// buttonViewStyle={...}, logoStyle={...} and textStyle={...}
