import * as React from 'react'
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native'
import {
  Div,
  Text,
  Button,
  Icon,
  Image,
  Input,
  Dropdown,
  Modal,
} from 'react-native-magnus'
import { useFirebase } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Log from '../util/Log'
import Styles from '../util/Styles'
import { GDHeader, InputWithSelection, GDFontText } from '../components'
import UserService from '../services/user'
import { useI18n } from '../hooks'

interface ProfileEditScreenProps {
  navigation: any
}

// Move camera position down in image picker area
// change text fields to the ones like the ones in the purchase page
// Change bottom bottom conditonally according to device with solution from [ SW , AWH ]
// Change Dropdown to dropdownPicker --> all of them [ signup and edit profile ]
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen')
const { useState, useEffect, createRef } = React
const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({
  navigation,
}) => {
  const firebase = useFirebase()
  const profile = useSelector((state: any) => state.firebase.profile)
  const dropdownRef = createRef()
  const { signupReason: signupReasonText, signupReasons } = useI18n('register')
  const t = useI18n('profileEdit')
  const insets = useSafeAreaInsets()

  const [profilePic, setProfilePic] = useState(profile?.photoURL ?? '')
  const [nicknameEditable, setNicknameEditable] = useState(false)
  const [nickname, setNickname] = useState(profile.nickname)
  const [signupReason, setSignupReason] = useState(profile?.signupReason ?? '')
  const [picUploading, setPicUploading] = useState<boolean>(false)

  const handleNicknameEditable = () => setNicknameEditable(!nicknameEditable)

  const handleNoImagePress = () => {
    // dropdownRef.current.open()
    Alert.alert('Choose Image', 'Select Type', [
      {
        text: 'Camera',
        onPress: () => handleChooseCameraForPic(),
      },
      {
        text: 'Choose from library',
        onPress: () => handleChooseGalleryForPic(),
      },
      {
        text: 'Cancel',
        onPress: () => Log.debug('Cancel Pressed'),
        style: 'cancel',
      },
    ])
  }

  useEffect(() => setProfilePic(profile?.photoURL ?? ''), [profile])

  const handleChooseCameraForPic = () => {
    Log.debug('fired handleChooseCameraForPic')
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        setProfilePic(image.path)
        Log.debug(image)
        Log.debug('aaAAAAAAAAAAAAAA')
        uploadToServer(image)
      })
      .catch((err) => {
        Log.debug('handleChooseCameraForPic: err:', err)
      })
  }

  const handleChooseGalleryForPic = async () => {
    // setPicUploaded(!picUploading)
    let image
    image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      // includeBase64: true,
    })
    uploadToServer(image.path)
  }

  const uploadToServer = async (image) => {
    setPicUploading(true)
    Log.debug('uploadToServer: image:', image)
    const { uid } = firebase.auth().currentUser
    try {
      let uploadedFile
      uploadedFile = await firebase
        .app()
        .storage()
        .ref('/client/profilePic/' + uid + '.jpg')
        .putFile(image)

      Log.debug('uploadedFile:', uploadedFile)
      Log.debug('downloadURL', uploadedFile)
      const fileUploadSnapShot = await firebase
        .app()
        .storage()
        .ref('/client/profilePic/' + uid + '.jpg')
      Log.debug('fileUploadSnapShot:', fileUploadSnapShot)
      const downloadUrl = await fileUploadSnapShot.getDownloadURL()
      Log.debug('downloadURL:', downloadUrl)
      let tmp = await firebase.updateProfile({ photoURL: downloadUrl })
      setProfilePic(downloadUrl)
      setPicUploading(false)

      Alert.alert('Profile picture updated successfully')
      setPicUploaded(!picUploading)
    } catch (error) {
      setPicUploading(false)

      Log.error('failed to upload', error)
    }
  }

  const checkNickname = async (str: string) => {
    const doesItExist = await UserService.checkNickname(str)
    Log.debug(doesItExist)
    if (doesItExist.exists) {
      return Alert.alert('already exists')
    }
    Alert.alert('nickname is useable')
    setNicknameEditable(!nicknameEditable)
    return doesItExist
  }

  return (
    <>
      <Modal isVisible={picUploading} bg="transparent">
        <Div
          flex={1}
          bg="transparent"
          justifyContent="center"
          alignItems="center">
          <ActivityIndicator size="large" />
        </Div>
      </Modal>
      {/* {true && (
        <Div flex={1} position="relative">
          <Div
            flex={1}
            borderWidth={1}
            h={SCREEN_HEIGHT}
            w={SCREEN_WIDTH}
            bg="rgba(0,0,0,0.4)">
            <ActivityIndicator size="large" />
          </Div>
        </Div>
      )} */}
      <Div
        pt={insets.top}
        bg="white"
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <ScrollView>
          <Div bg="background" flex={1}>
            <GDHeader>{t.title}</GDHeader>
            {!nicknameEditable ? (
              <Div
                alignItems="center"
                borderTopWidth={1}
                borderColor={Styles.colors.grayscale.lightGray}
                pt="2xl">
                {profilePic == '' ? (
                  <TouchableOpacity onPress={handleNoImagePress}>
                    <Image
                      h={100}
                      w={100}
                      m="xs"
                      rounded="circle"
                      source={Styles.images.smallLogo}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleNoImagePress}>
                    <Image
                      h={100}
                      w={100}
                      m="xs"
                      rounded="circle"
                      source={{
                        uri: profilePic,
                      }}
                    />
                  </TouchableOpacity>
                )}
                <GDFontText fontSize="lg" fontWeight="700">
                  {profile.nickname}
                </GDFontText>
                <Icon
                  h={25}
                  w={25}
                  bg={Styles.colors.grayscale.allBlack}
                  rounded="xl"
                  name="camera"
                  fontSize="2xl"
                  color={Styles.colors.grayscale.white}
                  // position="absolute"
                  bottom={75}
                  left={30}
                />
              </Div>
            ) : null}
            <Div p="2xl">
              <Div
                pb="lg"
                borderBottomWidth={1}
                borderBottomColor={Styles.colors.grayscale.lightGray}>
                <Text fontSize="lg" color={Styles.colors.grayscale.dimGray}>
                  Phone number
                </Text>
                <Div p="xs" />
                <Text>
                  {profile.passAppData && profile.passAppData['phone num']}
                </Text>
              </Div>
              <Div p="xs" />
              <Div
                mt="xl"
                pb="lg"
                borderBottomWidth={1}
                borderBottomColor={Styles.colors.grayscale.lightGray}>
                <Text fontSize="lg" color={Styles.colors.grayscale.dimGray}>
                  {t.placeholderEmail}
                </Text>
                <Div p="xs" />
                <Text>{profile.email}</Text>
              </Div>
              {/* <Input placeholder={t.placeholderEmail} value ={email} fontSize="lg"></Input> */}
              <Div
                mt="xl"
                borderBottomWidth={1}
                borderBottomColor={Styles.colors.grayscale.lightGray}>
                <Text fontSize="lg" color={Styles.colors.grayscale.dimGray}>
                  {t.nickname}
                </Text>
                <Div p="xs" />
                <Div
                  row
                  justifyContent="space-between"
                  pr="lg"
                  py="xs"
                  pb="lg"
                  alignItems="center">
                  <Div>
                    {!nicknameEditable ? (
                      <Text py="lg">{nickname}</Text>
                    ) : (
                      <Input
                        value={nickname}
                        w={200}
                        onChangeText={setNickname}
                        focus={nicknameEditable}
                      />
                    )}
                  </Div>
                  <Div row alignItems="center">
                    <TouchableOpacity
                      onPress={() => {
                        handleNicknameEditable()
                        // focusNickname()
                      }}>
                      <Icon
                        name="edit"
                        fontFamily="MaterialIcons"
                        fontSize="4xl"
                        color="black"
                      />
                    </TouchableOpacity>
                    <Div px="lg" />
                    <Button
                      py="lg"
                      bg="main900"
                      disabled={!nicknameEditable}
                      onPress={() => {
                        checkNickname(nickname)
                      }}>
                      <Text color="background">확인</Text>
                    </Button>
                  </Div>
                </Div>
              </Div>
              <Div p="lg" />
              <Div
                pb="lg"
                borderBottomWidth={1}
                borderBottomColor={Styles.colors.grayscale.lightGray}>
                <Text fontSize="lg" color={Styles.colors.grayscale.dimGray}>
                  {t.signupReason}
                </Text>
                <Div p="sm" />
                <Div row justifyContent="space-between" pr="lg">
                  <Div>
                    <Text>{signupReason}</Text>
                  </Div>
                  <Div>
                    <TouchableOpacity
                      // onPress={() => setSignupReasonEditable(!signupReasonEditable)}>
                      onPress={() => dropdownRef.current.open()}>
                      <Icon
                        fontFamily="MaterialIcons"
                        name="edit"
                        fontSize="4xl"
                        color="black"
                      />
                    </TouchableOpacity>
                  </Div>
                </Div>
              </Div>
            </Div>
          </Div>
        </ScrollView>
        {/* <Div
          // bg="main900"
          position="absolute"
          bottom={0}
          pb={Platform.OS == 'android' ? 0 : insets.bottom}>
          <Button
            disabled={nicknameEditable}
            block
            bg="main900"
            py="xl"
            onPress={() => {
              firebase.updateProfile({ nickname, signupReason })
              navigation.goBack()
            }}>
            <Text color="background" fontSize="xl">
              {t.saveButton}
            </Text>
          </Button>
        </Div> */}
        {Platform.OS == 'android' ? (
          <Div position="absolute" bottom={0}>
            <Button
              h={48}
              block
              rounded="none"
              onPress={() => {
                firebase.updateProfile({ nickname, signupReason })
                navigation.goBack()
              }}
              py="xl"
              bg="main900">
              {t.saveButton}
            </Button>
          </Div>
        ) : (
          <Div
            position="absolute"
            bottom={0}
            pb={insets.bottom}
            bg="white"
            p="md">
            <Button
              // h={64}
              h={48}
              block
              rounded="circle"
              onPress={() => {
                firebase.updateProfile({ nickname, signupReason })
                navigation.goBack()
              }}
              // py="xl"
              bg="main900"
              fontSize="lg">
              {t.saveButton}
            </Button>
          </Div>
        )}
      </Div>

      <Dropdown
        ref={dropdownRef}
        title={
          <Text
            mx="xl"
            color="gray900"
            pb="md"
            fontSize="3xl"
            textAlign="center">
            {signupReasonText}
          </Text>
        }
        // mt="md"
        // pb="2xl"
        w={'100%'}
        showSwipeIndicator={true}
        roundedTop="xl">
        <Div w="100%" p="xl" justifyContent="center">
          {signupReasons.map((reason: string, i: number) => (
            <TouchableOpacity
              key={String(i)}
              onPress={() => {
                setSignupReason(reason)
                dropdownRef.current.close()
              }}>
              <GDFontText fontWeight="700" fontSize="xl" p="md">
                {reason}
              </GDFontText>
            </TouchableOpacity>
          ))}
        </Div>
      </Dropdown>
    </>
  )
}

const styles = StyleSheet.create({})

export default ProfileEditScreen
