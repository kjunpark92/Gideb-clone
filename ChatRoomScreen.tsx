import { useNavigation, useRoute } from '@react-navigation/core'
import React, { useContext, useState, useEffect } from 'react'
import { Button, Div, Image, Text, useTheme, Icon } from 'react-native-magnus'
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  MessageText,
  Send,
} from 'react-native-gifted-chat'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { firebase } from '@react-native-firebase/firestore'
import { UserTypeContext } from '../context/UserTypeContext'
import Styles from '../util/Styles'
import Log from '../util/Log'
import { Alert, Linking, Platform } from 'react-native'
import config from '../config'
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase'
import { usePagingFirestoreConnect } from '../hooks/usePagingFirestoreConnect'
import { useI18n } from '../hooks'
import asyncStorage from '../asyncStorage'
import { GDHeader } from '../components'
import screens from '../navigation/screens'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ChatRoomScreen({}) {
  const route = useRoute()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { chatroom } = route.params
  const members = chatroom.members.reduce(
    (obj: any, cur: any) => ({ ...obj, [cur.uid]: _.omit(cur, ['id', 'uid']) }),
    {},
  )

  const insets = useSafeAreaInsets()

  const t = useI18n('chatroom')
  const [text, setText] = useState('')
  const [loadEarlier, setLoadEarlier] = useState(false)
  const [cursor, setCursor] = useState(undefined)
  const [messagesToLoad, setMessagesToLoad] = useState(20)

  const { loading, data, error, nextPage } = usePagingFirestoreConnect({
    collection: `chatrooms/${chatroom.id}/messages`,
    orderBy: ['createdAt', 'desc'],
    limit: 5,
    startAfter: cursor,
  })
  const firestore = useFirestore()

  useEffect(() => {
    asyncStorage.set(`@chatroom/${chatroom.id}`, { lastVisitedAt: +new Date() })
    return () => {
      // cleanup
    }
  }, [])

  const messages = _.orderBy(
    data.map((item) => ({
      _id: item.id,
      text: item.text,
      createdAt: item.createdAt
        ? new Date(item.createdAt._seconds * 1000)
        : new Date(),
      user: {
        _id: item.author,
        name: members[item.author].displayName,
        avatar: members[item.author].photoURL || Styles.images.profile,
      },
    })),
    'createdAt',
    'asc',
  )

  const { uid } = useSelector((state) => state.firebase.auth)
  const counterPart = chatroom.members.filter(
    (member: { uid: string }) => member.uid !== uid,
  )[0]

  const { userType } = useContext(UserTypeContext)

  function onSend(message) {
    Log.debug('message = ', message)
    try {
      firestore.add(`chatrooms/${chatroom.id}/messages`, {
        text: message.text,
        createdAt: firestore.FieldValue.serverTimestamp(),
        author: uid,
      })
      // chatStore.sendMessage(chatroomId, message)
    } catch (err) {
      // TODO: In case you fail to send a message, you need to handle it in the chatStore
      // such as adding a 'X' icon like kakao, or simply delete the failed message.
    }
    // chatsRef.unshift(message);
  }

  const renderBubble = (props) => {
    if (userType == 'client') {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: { backgroundColor: Styles.colors.client.light },
            right: { backgroundColor: Styles.colors.client.main },
          }}
          timeTextStyle={{
            left: { color: '#000' },
            right: { color: Styles.colors.text.light },
          }}
        />
      )
    } else {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: { backgroundColor: Styles.colors.provider.light },
            right: { backgroundColor: Styles.colors.provider.main },
          }}
          timeTextStyle={{
            left: { color: '#000' },
            right: { color: Styles.colors.text.light },
          }}
        />
      )
    }
  }

  const sendbuttonInActive = (
    <Image source={Styles.images.chatSendButton} w={34} h={34} />
  )
  const sendButtonActive = (
    <Image
      source={
        userType === 'client'
          ? Styles.images.chatSendButton
          : Styles.images.chatSendButton
      }
      w={34}
      h={34}
    />
  )

  const renderSend = (props) => {
    return (
      <Send
        {...props}
        containerStyle={{
          width: 34,
          height: 34,
          borderWidth: 0,
          position: 'absolute',
          right: -42,
          top: 6,
        }}>
        <Div w={34}>{text === '' ? sendbuttonInActive : sendButtonActive}</Div>
      </Send>
    )
  }

  const renderInputToolBar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: theme.colors.gray150,
          paddingHorizontal: 23,
          paddingVertical: 14,
          height: 68,
          justifyContent: 'center',
          bottom: 20,
        }}
        primaryStyle={{
          height: 50,
          paddingTop: 10,
          borderRadius: 50,
          borderWidth: 1,
          borderColor: 'rgba(18,18,18,0.1)',
          backgroundColor: 'white',
          marginRight: 40,
        }}
      />
    )
  }

  const callNumber = (phone: string) => {
    Log.debug('Chat: callNumber: phone:', phone)
    let phoneNumber = phone
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`
    } else {
      phoneNumber = `tel:${phone}`
    }
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Phone number is not available')
        } else {
          return Linking.openURL(phoneNumber)
        }
      })
      .catch((err) => {
        Log.error('Chat: callNumber: canOpenURL: ERROR:', err)
      })
  }

  const renderFooterArea = function () {
    return <Div h={50} />
  }

  const parsePattersHandler = function (linkStyle) {
    return [
      {
        type: 'phone',
        style: { textDecorationLine: 'underline' },
        onPress: (phoneNum: string) => {
          Log.debug(phoneNum)
          callNumber(phoneNum)
        },
      },
      // {
      //   pattern: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
      //   style: {textDecorationLine: 'underline'},
      //   onPress: () => console.log('pressed'),
      // },
    ]
  }

  // const LOAD_EARLIER_ON_SCROLL_HEGHT_OFFSET = 100;

  // ...
  function isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 80
    return (
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y
    )
  }

  const onPressAvatar = ({ _id: uid }) => {
    const member = chatroom.members.filter(
      (member: { uid: any }) => member.uid === uid,
    )[0]
    console.log('onPressAvatar props = ', member)

    navigation.navigate(screens.PROVIDER_PROFILE, { provider: member })
  }

  return (
    <Div flex={1} bg="white" pt={insets.top}>
      <GDHeader
        // shadow="xs"
        bottomLine
        // h={56}
        // suffix={
        //   <Button bg="transparent" onPress={() => navigation.goBack()}>
        //     <Icon
        //       fontSize="2xl"
        //       fontFamily="MaterialCommunityIcons"
        //       name="close"
        //       color="black"
        //     />
        //   </Button>
        // }
      >
        <Div row h={26} w={'100%'} justifyContent="center" alignItems="center">
          <Image
            rounded="circle"
            borderWidth={2}
            borderColor="gray150"
            mr="sm"
            source={
              counterPart.photoURL
                ? { uri: counterPart.photoURL }
                : Styles.images.profile
            }
            w={24}
            h={24}
          />
          <Text fontSize="xl">{counterPart.displayName}</Text>
        </Div>
      </GDHeader>
      {chatroom.id ? (
        <GiftedChat
          onSend={onSend}
          renderComposer={(props) => (
            <Composer {...props} textInputStyle={{ maxHeight: 50 }} />
          )}
          maxComposerHeight={40}
          messagesContainerStyle={{
            backgroundColor: Styles.colors.grayscale.lighterGray,
          }}
          listViewProps={{
            scrollEventThrottle: 400,
            onScroll: ({ nativeEvent }) => {
              if (isCloseToTop(nativeEvent)) setLoadEarlier(true)
            },
          }}
          onLoadEarlier={async () => {
            setLoadEarlier(false)
            setCursor(data[data.length - 1].createdAt)
          }}
          onPressAvatar={onPressAvatar}
          // infiniteScroll={true}
          loadEarlier={loadEarlier}
          renderFooter={renderFooterArea}
          // bottomOffset={400}
          scrollToBottom
          alwaysShowSend
          inverted={false}
          // (Bool) - Reverses display order of messages; default is true
          // isTyping={text !== ''}
          onInputTextChanged={(text) => setText(text)}
          renderBubble={renderBubble}
          // renderComposer={renderComposer}
          renderSend={Platform.OS === 'ios' ? renderSend : undefined}
          renderInputToolbar={
            Platform.OS === 'ios' ? renderInputToolBar : undefined
          }
          placeholder={t.chatInputPlaceholder}
          messages={messages.slice(0)}
          onSend={(messages) => onSend(messages[0])}
          parsePatterns={parsePattersHandler}
          user={{
            _id: uid,
          }}
          locale={config.getLang()}
        />
      ) : null}
    </Div>
  )
}
