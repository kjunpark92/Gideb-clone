import * as React from 'react'
import { TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { Div, Text, Button, Checkbox, Icon, Input } from 'react-native-magnus'
import axios from 'axios'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DropDownPicker from 'react-native-dropdown-picker'
import { useNavigation } from '@react-navigation/core'
import { useFirebase } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

import Styles from '../util/Styles'
import Log from '../util/Log'
import CustomWebView from '../util/CustomWebView'
import { GDHeader } from '../components'
import UserService from '../services/user'
import Config from '../config'
import { useI18n } from '../hooks'
import { UserTypeContext } from '../context/UserTypeContext'

const { useState, useEffect, useRef, useContext } = React
export default function ExtraInfoForSocialInfo() {
  const insets = useSafeAreaInsets()
  const t = useI18n('register')
  const navigation = useNavigation()
  const firebase = useFirebase()
  const profile = useSelector((state: any) => state.firebase.profile)
  const { userType } = useContext(UserTypeContext)

  const [nickname, setNickname] = useState('')
  const [nicknameErr, setNicknameErr] = useState(false)
  const [signupReason, setSignupReason] = useState('')
  const [dreamSecWebView, setDreamSecWebView] = useState(false)
  const [dreamSecInfo, setDreamSecInfo] = useState<any>({})
  const [agree1, setAgree1] = useState(false)
  const [agree2, setAgree2] = useState(false)
  const [agree3, setAgree3] = useState(false)
  const [onCheckingNickname, setOnCheckingNickname] = useState(false)
  let submitDisabled = true
  if (
    nickname != '' &&
    signupReason != '' &&
    Object.values(dreamSecInfo).length != 0 &&
    agree1 &&
    agree2 &&
    agree3
  )
    submitDisabled = false

  const submitUser = () => {
    const { uid, email, photoURL } = firebase.auth().currentUser
    let userPkg = {
      email,
      nickname,
      signupReason,
      passAppData: dreamSecInfo,
      phoneNo: dreamSecInfo['phone num'],
      level: userType == 'client' ? 1 : 2,
      photoURL,
    }

    firebase.updateProfile(userPkg)
  }

  useEffect(() => {
    // Log.debug('useEffect: change in profile: profile =', profile)
  }, [profile])

  const handleWebViewNavigationStateChange = (newNavState: any) => {
    const { url } = newNavState
    if (!url) return

    if (url.includes('?priinfo=')) {
      axios
        .get(url)
        .then((res) => {
          Log.debug('CustomWebView: ONRESULT:', res.data)
          setDreamSecInfo(res.data)

          setDreamSecWebView(false)
        })
        .catch((err) => Log.debug('ERROR:', err))
    }
  }

  const webview = useRef(null)
  const DreamSecVerification = (
    <Modal visible={dreamSecWebView} style={{}}>
      <Div flex={1} zIndex={100} pt={insets.top}>
        <CustomWebView
          ref={webview}
          pageUrl={Config.getPhoneVerifyUrl()}
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
            // borderWidth={1}
            onPress={() => {
              Log.debug('pressed')
              // navigation.goBack()
              setDreamSecWebView(false)
            }}>
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
  )

  return (
    <>
      {DreamSecVerification}
      <Div pt={insets.top} p="lg" flex={1} bg="white">
        <GDHeader bottomLine>{t.messages.enterAdditionalInfo}</GDHeader>
        <Div pt="xl">
          <Text fontSize="3xl">{'소셜 로그인 하셨습니다.'}</Text>
          <Div p="sm" />
          <Text fontSize="lg">{'추가정보를 입력해주세요.'}</Text>
        </Div>
        <Div pt="xl" zIndex={10000} minH={350}>
          <Input
            autoCorrect={false}
            placeholder="닉네임 (최대 8자까지 가능합니다.)"
            onChangeText={(text) => {
              setNickname(text)
              setNicknameErr(false)
            }}
            value={nickname}
            autoCapitalize="none"
          />
          {nicknameErr ? (
            <Text fontSize="sm" color="red">
              {t.messages.onNicknameDuplicatation}
            </Text>
          ) : (
            <Div p="sm" />
          )}
          <DropDownPicker
            items={t.signupReasons.map((reason: string) => {
              return { label: reason, value: reason }
            })}
            placeholder={'가입이유를 선택하세요.'}
            placeholderStyle={{ color: Styles.colors.grayscale.silver }}
            containerStyle={{
              height: 55,
              // zIndex: 100000,
            }}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            defaultValue={signupReason}
            // style={{ backgroundColor: '#ffffff' }}
            dropDownStyle={{ zIndex: 10000 }}
            onChangeItem={async (item) => {
              // Log.debug('onChangeItem: ', item, nickname)
              const { exists } = await UserService.checkNickname(nickname)
              if (exists) {
                setNickname('')
                setNicknameErr(true)
              }
              setSignupReason(item.value)
            }}
          />

          <Div p="sm" />
          <Div>
            <Button
              bg="main900"
              block
              rounded="circle"
              onPress={() => {
                setDreamSecWebView(true)
              }}>
              {t.messages.selfCertification}
            </Button>
            <Div borderBottomWidth={1} borderBottomColor="gray400" p="lg" />
            <Div mt="xl">
              <Checkbox
                checked={agree1}
                onChecked={(checked) => {
                  setAgree1(checked)
                  setAgree2(checked)
                  setAgree3(checked)
                }}
                prefix={<Text flex={1}>{t.agree1}</Text>}
              />
              <Checkbox
                checked={agree2}
                onChecked={(checked) => setAgree2(checked)}
                prefix={<Text flex={1}>{t.agree2}</Text>}
              />
              <Checkbox
                checked={agree3}
                onChecked={(checked) => setAgree3(checked)}
                prefix={<Text flex={1}>{t.agree3}</Text>}
              />
            </Div>
          </Div>
          <Div p="md" />
          <Div>
            <Button
              block
              bg="main900"
              rounded="circle"
              disabled={submitDisabled}
              onPress={submitUser}>
              {t.messages.enterAdditionalInfo}
            </Button>
            <Div p="sm" />
            <TouchableOpacity>
              <Text
                textAlign="center"
                color="main900"
                fontSize="lg"
                onPress={() => navigation.goBack()}>
                {t.messages.cancel}
              </Text>
            </TouchableOpacity>
          </Div>
        </Div>
      </Div>
    </>
  )
}

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    borderWidth: 0,
    right: 20,
    top: 30,
  },
})
