import * as React from 'react'
import { Div, Text, useTheme, Image, Button } from 'react-native-magnus'

import { GDFontText, GDHeader } from '../components'
import { useI18n } from '../hooks'
import GDSearchInput from '../components/GDSearchInput'
import {
  isLoaded,
  populate,
  useFirebase,
  useFirestoreConnect,
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import axios from 'axios'
import UserService from '../services/user'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Config from '../config'
import Log from '../util/Log'
import Styles from '../util/Styles'
import Chatroom from '../components/Chatroom'
import dayjs from 'dayjs'
import screens from '../navigation/screens'

const TEMP_LANG = {
  ko: {
    acceptReq: '수락',
    decineReq: '거절',
  },
}

const { useEffect, useState } = React
export default function ChatRoomsScreen({ navigation }) {
  const t = useI18n('chatrooms')
  const g = useI18n('general')
  const firebase = useFirebase()
  const { theme } = useTheme()
  const { profile } = useSelector((state) => state.firebase)

  const uid = firebase.auth()?.currentUser?.uid ?? null

  const acceptOrDecline = async (chatId: string, status: string) => {
    try {
      await UserService.acceptOrDeclineProviderForClient(chatId, status)
    } catch (error) {
      Log.error('acceptOrDecline: error =', error)
    }
  }

  useEffect(() => {
    // Log.debug('uid** =', uid)
  }, [])

  const populates = [
    { child: 'requestee', root: 'publicUsers' },
    { child: 'requester', root: 'publicUsers' },
    { child: 'members', root: 'publicUsers' },
  ]

  useFirestoreConnect([
    {
      collection: 'chatrooms',
      where: ['members', 'array-contains', uid ? uid : ''],
      populates,
    },
  ])

  const AcceptOrDeclineChatBlock = ({ chatroom, id }) => {
    return (
      <Div
        row
        // borderWidth={1}
        h={76}
        my="sm"
        rounded="xl"
        p={16}
        bg="gray150"
        justifyContent="space-between">
        <Div row>
          <Image
            source={
              chatroom.requestee?.photoURL
                ? { uri: chatroom.requestee.photoURL }
                : Styles.images.profile
            }
            w={44}
            h={44}
            rounded="circle"
            bg="white"
          />
          {/* <Text>{chatroom.requestee.displayName}</Text> */}
          <Div justifyContent="center" mx="lg">
            <Text fontSize="xl" mb="xs">
              {chatroom.requestee.displayName}
            </Text>
          </Div>
        </Div>
        <Div row pt="sm">
          <Button
            w={75}
            h={30}
            p={0}
            bg="main900"
            rounded="circle"
            mr="sm"
            onPress={() => {
              acceptOrDecline(id, 'accepted')
            }}>
            <GDFontText color="white" fontSize="md">
              {g.acceptReq}
            </GDFontText>
          </Button>
          <Button
            w={75}
            h={30}
            p={0}
            bg="gray900"
            rounded="circle"
            ml="sm"
            onPress={() => {
              acceptOrDecline(id, 'declined')
            }}>
            <GDFontText color="white" fontSize="md">
              {g.declineReq}
            </GDFontText>
          </Button>
        </Div>
      </Div>
    )
  }

  const chatrooms = useSelector((state) =>
    populate(state.firestore, 'chatrooms', populates),
  )

  // const [allChats, setAllChats] = useState([])
  useEffect(() => {
    return () => {
      // cleanup
    }
  }, [])

  const insets = useSafeAreaInsets()

  return (
    <Div flex={1} bg="white" pt={insets.top}>
      <Div flex={1}>
        <GDHeader
          bottomLine
          prefix={null}
          fontWeight="bold"
          fontSize={18}
          lineHeight={26}
          // shadow={'xs'}
        >
          {t.title}
        </GDHeader>
        {/* <GDSearchInput /> */}
        <Div px="xl" pt="xl">
          {chatrooms &&
            Object.entries(chatrooms)
              .filter(([i, c]) => c.status != 'accepted')
              .map(([id, chatroom], idx) => {
                return (
                  <AcceptOrDeclineChatBlock
                    key={idx}
                    chatroom={chatroom}
                    id={id}
                  />
                )
              })}
        </Div>
        <Div px="xl">
          <Chatroom type="chatbot" data={{ id: 'chatbot' }} />
          <Chatroom
            type="notification"
            data={{
              id: 'notification',
              chatroomIds: Object.keys(chatrooms ? chatrooms : {}),
            }}
          />
        </Div>
        <Div px="xl">
          {chatrooms &&
            Object.entries(chatrooms)
              .filter(([i, c]) => c.status == 'accepted')
              .map(([id, chatroom], idx) => {
                return (
                  <Chatroom key={id} data={{ id, ...chatroom }} type="client" />
                )
              })}
        </Div>
      </Div>
    </Div>
  )
}

// navigation.navigate(stacks.CHAT_STACK, { screen: screens.CHATBOT })
// navigation.navigate(stacks.CHAT_STACK, { screen: screens.NOTIFICATION })
