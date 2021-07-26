import { useNavigation } from '@react-navigation/core'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { Div, Image, Tag, Text } from 'react-native-magnus'
import screens from '../navigation/screens'
import Styles from '../util/Styles'
import asyncStorage from '../asyncStorage'
import Log from '../util/Log'
import Config from '../config'
import { useDispatch, useSelector } from 'react-redux'
import {
  setProviderNewClients,
  setProviderRegClients,
} from '../redux/Chat/ChatActions'

export default function Chatroom({ type = 'client', data = {} }) {
  Log.debug('Chatroom: data =', data, type)
  const member =
    type === 'client'
      ? data.requestee
      : type === 'provider'
      ? data.requester
      : type === 'chatbot'
      ? {
          displayName: '챗봇',
          photoURL: Styles.images.chatbotAvatar,
          uid: 'chatbot',
        }
      : type == 'notification'
      ? { displayName: '알림봇', photoURL: null, uid: 'notification' }
      : null
  // let member = type == 'chatbot' ?   { displayName: '챗봇', photoURL: null, uid: 'chatbot' } :

  const dispatch = useDispatch()

  // providerNewClients: 0,
  // providerRegClients: 0,
  const { providerNewClients, providerRegClients } = useSelector(
    (state: any) => state.chat,
  )

  const { id, lastMessage, updatedAt: _updatedAt = new Date() } = data

  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    // Log.debug('data********************', data)
    // Log.debug('member******************', member)
    try {
      const checkNew = async () => {
        const chat = await asyncStorage.get(`@chatroom/${id}`)
        // Log.debug('chat = ', chat, id)
        if (!chat) return
        const { lastVisitedAt } = chat
        // Log.debug('lastVisitedAt = ***', lastVisitedAt)
        // Log.debug('_updatedAt._seconds = ', _updatedAt._seconds * 1000)
        const _isNew = lastVisitedAt < _updatedAt._seconds * 1000
        // Log.debug('_isNew =', _isNew)
        setIsNew(_isNew)

        // const chat = await asyncStorage.get(`@chatroom/${id}`)
        // Log.debug('chat =', chat)
      }
      checkNew()
    } catch (error) {
      Log.error('error =', error)
    }
    return () => {
      // cleanup
    }
  }, [data])

  console.log('data = ', _updatedAt)

  const updatedAt = _updatedAt._seconds
    ? dayjs(_updatedAt._seconds * 1000)
    : dayjs(_updatedAt)

  const navigation = useNavigation()
  return (
    <TouchableWithoutFeedback
      onPress={() =>
        type === 'chatbot'
          ? navigation.navigate(screens.CHATBOT)
          : type == 'notification'
          ? navigation.navigate(screens.NOTIFICATION, { reqData: data })
          : // : navigation.navigate(screens.CHATROOM, { type, chatroom: data })
            navigation.navigate('chatRoomProvider', { type, chatroom: data })
      }>
      <Div
        // borderWidth={1}
        maxH={76}
        my="sm"
        rounded="xl"
        p={16}
        bg="gray150"
        justifyContent="space-between"
        row>
        <Div row>
          <Image
            source={
              member.uid == 'chatbot'
                ? member.photoURL
                : member?.photoURL
                ? { uri: member.photoURL }
                : Styles.images.profile
            }
            w={44}
            h={44}
            rounded="circle"
            bg="white"
          />
          <Div justifyContent="center" mx="lg">
            <Text fontSize="xl" mb="xs">
              {member?.displayName}
            </Text>
            <Text color="gray400">
              {lastMessage && String(lastMessage).replace(/\n+/, '')}
            </Text>
          </Div>
        </Div>
        <Div>
          <Text textAlign="right">{dayjs(updatedAt).format('YYYY.MM.DD')}</Text>
        </Div>
        {isNew && (
          <Div
            position="absolute"
            right={20}
            bottom={20}
            bg="red500"
            px="md"
            // py="xs"
            rounded="circle">
            <Text color="white">N</Text>
          </Div>
        )}
      </Div>
    </TouchableWithoutFeedback>
  )
}
