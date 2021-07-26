import * as React from 'react'
import { Div, Text, Image, useTheme, Button, Icon } from 'react-native-magnus'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFirestore, useFirebase } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import {
  GiftedChat,
  Send,
  InputToolbar,
  Bubble,
} from 'react-native-gifted-chat'
import { UserTypeContext } from '../context/UserTypeContext'
import { useNavigation } from '@react-navigation/core'
import axios from 'axios'

import Config from '../config'
import Log from '../util/Log'
import Styles from '../util/Styles'
import asyncStorage from '../asyncStorage'
import storageItems from '../asyncStorage/storageItems'
import { GDHeader } from '../components'
import { Platform } from 'react-native'

interface Props {
  route: any
}

const { useState, useCallback, useEffect, useContext } = React
export default function NotificationChatScreen({ route }: Props) {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const { userType } = useContext(UserTypeContext)
  const { theme } = useTheme()
  const firebase = useFirebase()

  const [messages, setMessages] = useState<any>([])
  const [text, setText] = useState<string>('')

  const getNotifications = async () => {
    const gotNotifications = await asyncStorage.get(storageItems.NOTIFICATIONS)
    return gotNotifications ? setMessages([]) : setMessages([])
  }

  const getAllMsgs = async () => {
    Log.debug(firebase.auth().currentUser.uid, reqData.chatroomIds)
    const { data } = await axios.post(
      'http://localhost:5001/gideb-firebase/asia-northeast3/getAllMsgs',
      {
        uid: firebase.auth().currentUser.uid,
        chatroomIds: reqData?.chatroomIds ?? [],
      },
    )
    const msgs = data.flat(1).map((msg: any, i: number) => {
      return {
        _id: i,
        text: msg.text,
        createdAt: msg.createdAt,
        user: {
          _id: msg.author,
          name: msg.author,
          avatar: Styles.images.profile,
        },
      }
    })
    setMessages(msgs)
  }

  const { reqData = null } = route?.params

  useEffect(() => {
    getNotifications()
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages: any) =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  const sendbuttonInActive = (
    <Image source={Styles.images.chatSendButton} w={44} h={44} />
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

  const renderSend = (props: any) => (
    <Send
      disabled
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

  const renderInputToolBar = (props) => (
    <InputToolbar
      render={null}
      {...props}
      containerStyle={{
        backgroundColor: theme.colors.gray150,
        paddingHorizontal: 23,
        paddingVertical: 14,
        height: 68,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
      }}
      primaryStyle={{
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(18,18,18,0.1)',
        backgroundColor: 'white',
        marginRight: 40,
      }}
    />
  )

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

  return (
    <Div pt={insets.top} bg="white" flex={1}>
      <GDHeader
        // shadow="xs"
        bottomLine
        h={56}
        // suffix={
        //   <Button bg="transparent" onPress={() => navigation.goBack()}>
        //     <Icon
        //       w={20}
        //       h={20}
        //       name="close"
        //       fontFamily="AntDesign"
        //       color="black"
        //       fontSize="xl"
        //     />
        //   </Button>
        // }
      >
        <Div row h={26} justifyContent="center" alignItems="center">
          <Image
            rounded="circle"
            borderWidth={2}
            borderColor="gray150"
            mr="sm"
            source={Styles.images.profile}
            w={24}
            h={24}
          />
          <Text fontSize="xl">{'알림'}</Text>
        </Div>
      </GDHeader>
      <GiftedChat
        disableComposer={true}
        messagesContainerStyle={{
          backgroundColor: Styles.colors.grayscale.lighterGray,
        }}
        renderBubble={renderBubble}
        locale={Config.getLang()}
        alwaysShowSend
        renderFooter={() => <Div h={50} />}
        renderSend={Platform.OS === 'ios' ? renderSend : undefined}
        renderInputToolbar={
          Platform.OS === 'ios' ? renderInputToolBar : undefined
        }
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </Div>
  )
}
