import React, { useState, useRef, useContext, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  Div,
  Button,
  Checkbox,
  Text,
  Modal,
  Icon,
  WINDOW_HEIGHT,
} from 'react-native-magnus'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRoute, RouteProp } from '@react-navigation/native'
import GDUtil from '../util/GDUtil'
import UserService from '../services/user'
import Log from '../util/Log'

// toast message
import Toast from 'react-native-toast-message'
import { useI18n } from '../hooks'
import { useFirebase, useFirestore } from 'react-redux-firebase'
import GDHeader from '../components/GDHeader'
import config from '../config'
import Styles from '../util/Styles'
import GDLogo from '../components/GDLogo'
import InputWithTitle from '../components/InputWithTitle'
import CustomWebView from '../util/CustomWebView'
import axios from 'axios'
import InputWithPostcode from '../components/InputWithPostcode'
import InputWithSelection from '../components/InputWithSelection'
import RootStackParamList from '../navigation/RootStackParamList'
import { UserTypeContext } from '../context/UserTypeContext'

import _ from 'lodash'

type SignupScreenRouteProp = RouteProp<RootStackParamList, 'Signup'>

const SignupScreen: React.FC = () => {
  const firebase = useFirebase()
  const firestore = useFirestore()
  const route = useRoute<SignupScreenRouteProp>()
  const t = useI18n('register')
  const { userType } = useContext(UserTypeContext)
  const [modalVisible, setModalVisible] = useState(false)
  const webview = useRef(null)
  const insets = useSafeAreaInsets()
  const initialUser = {
    userType: userType,
    inviteCode: '',
    email: '',
    name: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    // address: '', // optional
    // address2: '', // deatil address
    level: userType == 'client' ? 1 : 2,
    signupReason: '',
    areaOfExpertise: null,
    passAppData: {},
    // invitationId: '',
    // clinicId: '',
    // phoneNo: ''
  }

  const [user, setUser] = useState(initialUser)
  const [validity, setValidity] = useState({
    emailValidity: false,
    nicknameValidity: false,
    passwordValidity: false,
    confirmPasswordValidity: false,
    emailChecked: false,
    nicknameChecked: false,
    passAppChecked: false,
    agree1: false,
    agree2: false,
    agree3: false,
    ...(userType === 'provider'
      ? {
          inviteCodeValidity: false,
          inviteCodeChecked: false,
          areaOfExpertiseSelected: false,
        }
      : { signupReasonSelected: false }),
  })
  const [onSaving, setOnSaving] = useState(false)
  const [onCheckingEmail, setOnCheckingEmail] = useState(false)
  const [onCheckingNickname, setOnCheckingNickname] = useState(false)
  const [onCheckingInviteCode, setOnCheckingInviteCode] = useState(false)
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(true)

  useEffect(() => {
    setIsReadyToSubmit(!_.every(Object.values(validity)))
    return () => {
      // cleanup
    }
  }, [validity])

  const handleTextChanged = (value: string, key: string) => {
    switch (key) {
      case 'inviteCode':
        setValidity({
          ...validity,
          inviteCodeValidity: GDUtil.validInviteCode(value),
          inviteCodeChecked: false,
        })
        break
      case 'email':
        setValidity({
          ...validity,
          emailValidity: GDUtil.validEmail(value),
          emailChecked: false,
        })
        break
      case 'nickname':
        setValidity({
          ...validity,
          nicknameValidity: value?.length > 2,
          nicknameChecked: false,
        })
        break
      case 'password':
        setValidity({
          ...validity,
          passwordValidity: GDUtil.validPassword(value),
        })
        break
      case 'confirmPassword':
        setValidity({
          ...validity,
          confirmPasswordValidity:
            GDUtil.validPassword(value) && user.password === value,
        })
        break
      default:
      // do nothig
    }
    Log.debug('user = ', user)
    Log.debug('validity = ', validity)
    setUser({ ...user, [key]: value })
  }

  const handleAddress = async (addressData: any) => {
    Log.debug('address data = ', addressData)
    const { address } = addressData
    setUser({ ...user, address })
  }

  const handleInviteCodeCheck = async () => {
    if (GDUtil.validInviteCode(user.inviteCode)) {
      try {
        setOnCheckingInviteCode(true)
        const { exists, clinic, invitation } =
          await UserService.checkInviteCode(user.inviteCode)
        Log.debug('exists = ', exists)
        Toast.show({
          type: 'info',
          text1:
            t.messages[exists ? 'onInviteCodeSuccess' : 'onInviteCodeNotFound'],
        })
        if (exists && invitation && clinic) {
          setUser({
            ...user,
            email: invitation.email,
            name: invitation.name,
            invitationId: invitation.id,
            clinicId: clinic.id,
          })
          setValidity({
            ...validity,
            emailChecked: true,
            emailValidity: true,
            inviteCodeChecked: true,
          })
        } else {
          setUser({ ...user, inviteCode: '' })
          setValidity({ ...validity, inviteCodeChecked: false })
        }
      } catch (error) {
        Log.error('failed to checkInviteCode: ', error)
      } finally {
        setOnCheckingInviteCode(false)
      }
    } else {
      Toast.show({
        type: 'info',
        text1: t.messages.onInvalidInviteCode,
      })
    }
  }

  const handleEmailCheck = async () => {
    if (GDUtil.validEmail(user.email)) {
      try {
        setOnCheckingEmail(true)
        const { exists } = await UserService.checkEmail(user.email)
        Log.debug('exists = ', exists)
        if (exists) {
          setUser({ ...user, email: '' })
          Toast.show({
            type: 'error',
            text1: t.messages.onEmailDuplication,
          })
        } else {
          Toast.show({ type: 'info', text1: t.messages.onEmailSuccess })
          setValidity({ ...validity, emailChecked: true })
        }
      } catch (error) {
        Log.error('failed to checkEmail: ', error)
      } finally {
        setOnCheckingEmail(false)
      }
    } else {
      Toast.show({
        type: 'info',
        text1: t.messages.onInvalidEmail,
      })
    }
  }

  const handleNicknameCheck = async () => {
    if (validity.nicknameValidity) {
      try {
        setOnCheckingNickname(true)
        const { exists } = await UserService.checkNickname(user.nickname)
        Log.debug('exists = ', exists)
        if (exists) {
          setUser({ ...user, nickname: '' })
          Toast.show({
            type: 'error',
            text1: t.messages.onNicknameDuplicatation,
          })
        } else {
          setValidity({ ...validity, nicknameChecked: true })
          Toast.show({
            type: 'info',
            text1: t.messages.onNicknameSuccess,
          })
        }
      } catch (error) {
        Log.error('failed to checkNickname: ', error)
      } finally {
        setOnCheckingNickname(false)
      }
    } else {
      Toast.show({
        type: 'info',
        text1: t.messages.onInvalidNickname,
      })
    }
  }

  const signupButtonPressed = async () => {
    Log.debug(userType)
    Log.debug('RegisterScreen: signupButtonPressed:', user)
    let userPkg = {
      passAppData: user.passAppData,
      email: user.email,
      nickname: user.nickname,
      // address: user.address,
      // address2: user.address2,
      level: Number(user.level),
      phoneNo: user.passAppData['phone num']
        ? '+82' + user.passAppData['phone num'].substring(1)
        : null,
    }
    if (userType == 'client') {
      userPkg = {
        ...userPkg,
        signupReason: user.signupReason,
      }
    } else if (userType == 'provider') {
      Log.debug('signupButtonPressed: provider call here')
      userPkg = {
        ...userPkg,
        name: user.name,
        invitationId: user.invitationId,
        clinicId: user.clinicId,
        areaOfExpertise: user.areaOfExpertise,
      }
    }

    try {
      setOnSaving(true)
      const userInfo = await firebase.createUser(
        { email: user.email, password: user.password },
        userPkg,
      )
      const { uid } = firebase.auth().currentUser
      await firebase.updateProfile(userPkg)
      if (userType === 'provider') {
        await UserService.confirmInvitedProviderSignedUp(
          user.clinicId,
          user.invitationId,
          uid,
        )
      }
    } catch (error) {
      Log.error('failed to sign up', error)
    } finally {
      setOnSaving(false)
    }
  }

  const handleModalVisible = () => {
    setModalVisible(!modalVisible)
  }
  const handleWebViewNavigationStateChange = (newNavState: any) => {
    const { url } = newNavState
    if (!url) return
    Log.debug(
      'CustomWebView: handleWebViewNavigationStateChange: newNavState:',
      newNavState,
      url,
    )
    if (url.includes('?priinfo=')) {
      axios
        .get(url)
        .then((res) => {
          Log.debug('CustomWebView: ONRESULT:', res.data)
          setUser({
            ...user,
            passAppData: res.data,
          })
          setModalVisible(false)
          setValidity({ ...validity, passAppChecked: true })
          Log.debug('AFTER PHONE VERIFICATION:', user)
        })
        .catch((err) => Log.debug('ERROR:', err))
    }
  }
  // let createDisabled = true
  // if (userType == 'client') {
  //   email
  // } else {
  // }
  return (
    <Div bg="white" flex={1} pt={insets.top}>
      <Div>
        <GDHeader>{t.title[userType]}</GDHeader>
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            height: WINDOW_HEIGHT * 1.5,
          }}>
          <GDLogo alignSelf="center" w={150} h={150} />
          {/* <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled> */}
          <Div p="lg" />
          {userType === 'provider' ? (
            <InputWithTitle
              validity={
                validity.inviteCodeValidity && validity.inviteCodeChecked
              }
              editable={
                !(validity.inviteCodeValidity && validity.inviteCodeChecked)
              }
              value={user.inviteCode}
              title={t.inviteCode}
              autoCapitalize="none"
              placeholder={t.inviteCodePlaceholder}
              onChangeText={(t) => handleTextChanged(t, 'inviteCode')}
              onBlur={handleInviteCodeCheck}
              loading={onCheckingInviteCode}
              mb="xl"
            />
          ) : null}
          {userType === 'provider' ? (
            <InputWithTitle
              validity={user.name.length > 0}
              value={user.name}
              title={t.name}
              editable={false}
              autoCapitalize="none"
              placeholder={t.namePlaceholder}
              loading={onCheckingInviteCode}
              mb="xl"
            />
          ) : null}
          {userType === 'provider' ? (
            <InputWithTitle
              editable={false}
              validity={validity.emailValidity && validity.emailChecked}
              title={t.email}
              value={user.email}
              placeholder={t.namePlaceholder}
              autoCapitalize="none"
              mb="xl"
              loading={onCheckingInviteCode}
            />
          ) : (
            <InputWithTitle
              validity={validity.emailValidity && validity.emailChecked}
              title={t.email}
              placeholder={t.emailPlaceholder}
              onChangeText={(t) => handleTextChanged(t, 'email')}
              keyboardType="email-address"
              autoCapitalize="none"
              mb="xl"
              onBlur={handleEmailCheck}
              loading={onCheckingEmail}
            />
          )}
          <InputWithTitle
            validity={validity.passwordValidity}
            title={t.password}
            placeholder={t.passwordPlaceholder}
            icon="eye"
            iconColor={Styles.colors.grayscale.darkGray}
            iconSize="xl"
            onChangeText={(t) => handleTextChanged(t, 'password')}
            secureTextEntry
            mb="xl"
          />
          <InputWithTitle
            validity={validity.confirmPasswordValidity}
            title={t.confirmPassword}
            placeholder={t.confirmPasswordPlaceholder}
            icon="eye"
            iconColor={Styles.colors.grayscale.darkGray}
            iconSize="xl"
            onChangeText={(t) => handleTextChanged(t, 'confirmPassword')}
            secureTextEntry
            mb="xl"
          />
          <InputWithTitle
            validity={validity.nicknameValidity}
            title={t.nickname}
            placeholder={t.nicknamePlaceholder}
            onChangeText={(t) => handleTextChanged(t, 'nickname')}
            autoCapitalize="none"
            mb="xl"
            onBlur={handleNicknameCheck}
            loading={onCheckingNickname}
          />
          {/* <InputWithPostcode
            validity={user.address.length > 0}
            editable={false}
            onSelected={handleAddress}
            value={user.address}
            title={t.address}
            placeholder={t.addressPlaceholder}
            mb="xl"
          />
          <InputWithTitle
            validity={user.address2.length > 0}
            title={t.address2}
            placeholder={t.address2Placeholder}
            onChangeText={(t) => handleTextChanged(t, 'address2')}
            autoCapitalize="none"
            mb="xl"
          /> */}
          {userType === 'provider' ? (
            <Div>
              <InputWithSelection
                validity={validity.areaOfExpertiseSelected}
                editable={false}
                title={t.areaOfExpertise}
                value={user.areaOfExpertise}
                placeholder={t.areaOfExpertisePlaceholder}
                options={t.areaOfExpertiseOptions}
                onSelected={(option) => {
                  setUser({ ...user, areaOfExpertise: option })
                  setValidity({ ...validity, areaOfExpertiseSelected: true })
                }}
                autoCapitalize="none"
                mb="xl"
              />
            </Div>
          ) : (
            <Div>
              <InputWithSelection
                validity={validity.signupReasonSelected}
                editable={false}
                title={t.signupReason}
                value={user.signupReason}
                placeholder={t.signupReasonPlaceholder}
                options={t.signupReasons}
                onSelected={(option) => {
                  setUser({ ...user, signupReason: option })
                  setValidity({ ...validity, signupReasonSelected: true })
                }}
                autoCapitalize="none"
                mb="xl"
              />
            </Div>
          )}
          <Button
            block
            onPress={handleModalVisible}
            bg="main900"
            rounded="circle">
            {t.phoneNumberVerification}
          </Button>
          <Div mt="xl">
            <Checkbox
              checked={validity.agree1}
              onChecked={(checked) =>
                setValidity({
                  ...validity,
                  agree1: checked,
                  agree2: checked,
                  agree3: checked,
                })
              }
              prefix={<Text flex={1}>{t.agree1}</Text>}
            />
            <Checkbox
              checked={validity.agree2}
              onChecked={(checked) =>
                setValidity({
                  ...validity,
                  agree1: checked && validity.agree3,
                  agree2: checked,
                })
              }
              prefix={<Text flex={1}>{t.agree2}</Text>}
            />
            <Checkbox
              checked={validity.agree3}
              onChecked={(checked) =>
                setValidity({
                  ...validity,
                  agree1: checked && validity.agree2,
                  agree3: checked,
                })
              }
              prefix={<Text flex={1}>{t.agree3}</Text>}
            />
          </Div>
          <Button
            mt="xl"
            bg="main900"
            block
            disabled={isReadyToSubmit}
            onPress={signupButtonPressed}
            loading={onSaving}>
            {t.submit}
          </Button>
          {/* </KeyboardAvoidingView> */}
        </ScrollView>
        <Modal isVisible={modalVisible}>
          <Div flex={1}>
            <CustomWebView
              ref={webview}
              pageUrl={config.getPhoneVerifyUrl()}
              onNavigationStateChange={handleWebViewNavigationStateChange}
            />
            <Div bg="transparent" style={styles.closeButton}>
              <Button
                bg="transparent"
                h={50}
                w={50}
                style={{
                  alignSelf: 'center',
                }}
                onPress={() => setModalVisible(false)}>
                <Icon
                  fontSize="5xl"
                  color="gray800"
                  name="cross"
                  fontFamily="Entypo"
                />
              </Button>
            </Div>
          </Div>
        </Modal>
      </Div>
    </Div>
  )
}

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    borderWidth: 0,
    right: 20,
    top: -5,
  },
})

export default SignupScreen
