// NEED TO FIX FONTS
import * as React from 'react'
import { StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native'
import { Button, Div, Text, Icon, Image } from 'react-native-magnus'
import { useFirebase } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker'
import { useNavigation } from '@react-navigation/core'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Log from '../util/Log'
import Styles from '../util/Styles'
import { GDHeader, FloatingChatOptionsButton } from '../components'
import screens from '../navigation/screens'
import stacks from '../navigation/stacks'
import { useI18n } from '../hooks'

interface MyPageScreenProps {}

const { useEffect, useState } = React
const MyPageScreen: React.FC<MyPageScreenProps> = ({}) => {
  const t = useI18n('myPage')
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  const firebase = useFirebase()
  const profile = useSelector((state: any) => state.firebase.profile)

  const [imagePickerType, setImagePickerType] = useState('')
  const [profilePic, setProfilePic] = useState(profile?.photoURL ?? undefined)
  const [chatPressed, setChatPressed] = useState<boolean>(false)

  const MYPAGE_SELECTIONS = [
    {
      name: t.faq.title,
      textBlocks: [
        { header: t.faq.ti1, text: t.faq.te1 },
        { header: t.faq.ti2, text: t.faq.te2 },
        { header: t.faq.ti3, text: t.faq.te3 },
        { header: t.faq.ti4, text: t.faq.te4 },
        { header: t.faq.ti5, text: t.faq.te5 },
      ],
      goTo: {
        labelFaqLink1: t.faq.labelFaqLink1,
        faqLink_1: t.faq.faqLink_1,
        labelFaqLink2: t.faq.labelFaqLink2,
        faqLink_2: t.faq.faqLink_2,
      },
    },
    {
      name: t.howToUse.title,
      textBlocks: [
        { header: t.howToUse.ti1, text: t.howToUse.te1 },
        { header: t.howToUse.ti2, text: t.howToUse.te2 },
        { header: t.howToUse.ti3, text: t.howToUse.te3 },
      ],
      goTo: {
        labelHowToUseLink: t.howToUse.labelHowToUseLink,
      },
    },
    {
      name: t.helpCenter.title,
      textBlocks: [{ header: t.helpCenter.t1 }],
      goTo: {
        labelHelpCenterLink: t.helpCenter.labelHelpCenterLink,
        helpCenterLink: t.helpCenter.helpCenterLink,
      },
    },
  ]

  useEffect(() => {
    setProfilePic(profile.photoURL)
  }, [profile])

  const goToSettings = () => navigation.navigate(screens.MYPAGE_SETTINGS)

  const goToProfileEdit = () =>
    navigation.navigate(stacks.MODAL_STACK, {
      screens: screens.PROFILE_EDIT,
    })

  const goToMyPageSelection = (
    title: string,
    textBlocks: string[],
    goTo: string,
  ) => {
    navigation.navigate(stacks.MODAL_STACK, {
      screen: screens.MYPAGE_SELECTION,
      params: { title, textBlocks, goTo },
    })
  }
  const goToPurchases = () => {
    navigation.navigate(screens.MYPAGE_PURCHASES)
  }
  const goToHospitalBookmarks = () => {
    navigation.navigate(stacks.MODAL_STACK, {
      screen: screens.HOSPITAL_BOOKMARKS,
    })
  }

  const handleNoImagePress = () => {
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

  const handleChooseCameraForPic = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        Log.debug(image)
      })
      .catch((err) => {
        Log.debug('handleChooseCameraForPic: err:', err)
      })
  }

  const handleChooseGalleryForPic = async () => {
    await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      // includeBase64: true,
    })
      .then(async (image) => {
        const { uid } = firebase.auth().currentUser
        try {
          firebase
            .app()
            .storage()
            .ref('/client/profilePic/' + uid + '.jpg')
            .putFile(image.path)
            .then(async (uploadedFile) => {
              const fileUploadSnapShot = await firebase
                .app()
                .storage()
                .ref('/client/profilePic/' + uid + '.jpg')
              const downloadUrl = await fileUploadSnapShot.getDownloadURL()
              await firebase.updateProfile({ photoURL: downloadUrl })
              await setProfilePic(downloadUrl)

              Alert.alert('Profile picture updated successfully')
            })
            .catch((err) => Log.error('failed getting download URL'))
        } catch (error) {
          Log.error('failed to upload', error)
        }
      })
      .catch((err) => {
        Log.debug('handleChooseGalleryForPic: err:', err)
      })
  }

  const handleChatIconPressed = () => setChatPressed(!chatPressed)

  return (
    <Div bg="white" flex={1} pt={insets.top}>
      <GDHeader
        bottomLine
        suffix={
          <TouchableOpacity onPress={goToSettings}>
            <Div p="lg">
              <Icon
                name="settings"
                fontFamily="MaterialIcons"
                fontSize="4xl"
                color="gray900"
              />
            </Div>
          </TouchableOpacity>
        }>
        {t.title}
      </GDHeader>

      <Div row alignItems="center" p="lg" my="lg">
        {profilePic == undefined ? (
          <TouchableOpacity onPress={handleNoImagePress}>
            <Image
              left={15}
              h={64}
              w={64}
              rounded="circle"
              source={Styles.images.avatar}
            />
          </TouchableOpacity>
        ) : (
          <Image
            left={15}
            h={64}
            w={64}
            rounded="circle"
            source={{
              uri: profilePic,
            }}
          />
        )}
        <Div row mx="2xl">
          <Text fontSize="lg" pt={Platform.OS == 'ios' ? 2 : 0} mr="xs">
            {profile.nickname}
          </Text>
          <Button
            onPress={goToProfileEdit}
            w={69}
            h={23}
            bg="gray900"
            py={2}
            px="lg"
            ml="sm"
            alignSelf="center"
            rounded="circle"
            alignItems="center"
            justifyContent="center">
            <Text fontSize="sm" color="background">
              {t.editButton}
            </Text>
          </Button>
        </Div>
      </Div>
      <Div
        alignItems="center"
        row
        rounded="xl"
        h={80}
        py="md"
        mx="xl"
        mt={10}
        mb={30}
        borderWidth={1}
        borderColor="gray150"
        bg="gray150">
        <Div flex={1}>
          <TouchableOpacity onPress={() => goToPurchases()}>
            <Div justifyContent="center">
              <Icon
                fontFamily="Entypo"
                name="credit-card"
                color="main900"
                fontSize="3xl"
              />
              <Text textAlign="center" mt="xs" fontSize="md">
                {t.purchaseHistory}
              </Text>
            </Div>
          </TouchableOpacity>
        </Div>
        <Div
          h={27}
          borderRightWidth={1}
          borderRightColor={Styles.colors.grayscale.lightGray}
        />
        <Div flex={1}>
          <TouchableOpacity onPress={() => goToHospitalBookmarks()}>
            <Div justifyContent="center">
              <Icon
                fontFamily="MaterialIcons"
                name="star"
                color="main900"
                fontSize="3xl"
              />
              <Text textAlign="center" mt="xs" fontSize="md">
                {t.starred}
              </Text>
            </Div>
          </TouchableOpacity>
        </Div>
        <Div
          h={27}
          borderRightWidth={1}
          borderRightColor={Styles.colors.grayscale.lightGray}
        />
        <Div flex={1}>
          <TouchableOpacity disabled>
            <Div justifyContent="center">
              <Icon
                fontFamily="Ionicons"
                name="trophy-outline"
                color="gray500"
                fontSize={20}
              />
              <Text textAlign="center" mt="xs" fontSize="md">
                {t.badges}
              </Text>
            </Div>
          </TouchableOpacity>
        </Div>
      </Div>
      {MYPAGE_SELECTIONS.map((selection, idx) => (
        <TouchableOpacity
          key={String(idx)}
          onPress={() =>
            goToMyPageSelection(
              selection.name,
              selection.textBlocks,
              selection.goTo,
            )
          }>
          <Div
            row
            borderBottomWidth={StyleSheet.hairlineWidth}
            borderBottomColor={Styles.colors.grayscale.lightGray}
            mx={24}
            mb={8}
            py={10}
            justifyContent="space-between">
            <Text fontSize="lg">{selection.name}</Text>
            <Icon
              fontFamily="Entypo"
              name="chevron-right"
              fontSize="3xl"
              color={Styles.colors.grayscale.allBlack}
            />
          </Div>
        </TouchableOpacity>
      ))}
      <FloatingChatOptionsButton
        navigateToChatbot={() =>
          navigation.navigate(stacks.CHAT_STACK, { screen: screens.CHATBOT })
        }
        navigateToNotification={() =>
          navigation.navigate(stacks.CHAT_STACK, {
            screen: screens.NOTIFICATION,
          })
        }
      />
    </Div>
  )
}

export default MyPageScreen
