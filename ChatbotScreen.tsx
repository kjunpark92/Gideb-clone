import * as React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { Div, Text, Image, useTheme, Button, Icon } from 'react-native-magnus'
import {
  GiftedChat,
  Send,
  Bubble,
  InputToolbar,
  MessageText,
  Composer,
} from 'react-native-gifted-chat'
import QuickReplies from 'react-native-gifted-chat/lib/QuickReplies'
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { GDHeader } from '../components'
import { UserTypeContext } from '../context/UserTypeContext'
import Styles from '../util/Styles'
import Log from '../util/Log'
import Config from '../config'
import { chatbotQuestions } from '../util/Chatbot'
import screens from '../navigation/screens'
import stacks from '../navigation/stacks'

const { useState, useEffect, useCallback, useContext } = React
export default function ChatbotScreen({ navigation }) {
  const { theme } = useTheme()
  const firestore = useFirestore()
  const { userType } = useContext(UserTypeContext)
  const { uid } = useSelector((state) => state.firebase.auth)

  const insets = useSafeAreaInsets()

  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [questionNum, setQuestionNum] = useState(1)

  useEffect(() => {
    const firstResp = chatbotQuestions(Config.getLang(), questionNum)
    Log.debug('firstResp =', firstResp)
    setQuestionNum(firstResp.nextQuestion)
    setMessages([
      {
        _id: 1,
        text: firstResp.chatbotResp,
        createdAt: new Date(),
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values: firstResp.replies,
        },
        user: {
          _id: 2,
          name: 'chatbot',
          avatar: Styles.images.chatbotAvatar,
        },
      },
    ])
  }, [])

  const onSend = (message) => {
    // Log.debug('messages =', messages)
    // Log.debug('message =', message)
    const resp = chatbotQuestions(Config.getLang(), 0, message[0].text)
    Log.debug('resp =', resp)
    setMessages(
      messages
        .concat(
          [
            {
              text: message[0].text,
              createdAt: new Date(),
              user: {
                _id: 1,
                name: 'client',
              },
            },
          ].concat([
            {
              // _id: 1,
              text: resp.chatbotResp,
              createdAt: new Date(),
              quickReplies: {
                type: 'radio',
                keepIt: true,
                values: resp.replies,
              },
              user: {
                _id: 2,
                name: 'chatbot',
                avatar: Styles.images.chatbotAvatar,
              },
            },
          ]),
        )
        .reverse()
        .map((messageJson, index) => {
          return {
            _id: index,
            text: messageJson.text,
            quickReplies: messageJson.quickReplies,
            createdAt: messageJson.createdAt,
            user: messageJson.user,
          }
        }),
    )
  }

  const sendbuttonInActive = (
    <Image source={Styles.images.chatSendButton} h={34} w={34} />
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
    Log.debug('renderSend: props =', props)
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

  const renderBubble = (props) => {
    if (userType == 'client') {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: Styles.colors.grayscale.lighterGray,
              padding: 5,
            },
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
        <Div p="lg">
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: Styles.colors.grayscale.lighterGray,
                padding: 20,
              },
              right: { backgroundColor: Styles.colors.grayscale.lighterGray },
            }}
            timeTextStyle={{
              left: { color: '#000' },
              right: { color: Styles.colors.text.light },
            }}
          />
        </Div>
      )
    }
  }

  const renderInputToolBar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: theme.colors.gray150,
        paddingHorizontal: 23,
        paddingVertical: 14,
        height: 68,
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
      }}
      primaryStyle={{
        // height: 70,
        // flex: 1,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(18,18,18,0.1)',
        backgroundColor: 'white',
        marginRight: 40,
      }}
    />
  )

  function handleQuickReply(quickReply) {
    // Log.debug('Chatbot: handleQuickReply: params: ', quickReply)
    const resp = chatbotQuestions(
      Config.getLang(),
      questionNum,
      quickReply[0].value,
    )
    Log.debug('resp =', resp)
    setQuestionNum(resp.nextQuestion)
    setMessages(
      messages
        .concat([
          {
            text: quickReply[0].title,
            createdAt: new Date(),
            user: {
              _id: 1,
              name: 'client',
            },
          },
        ])
        .concat([
          {
            // _id: 1,
            text: resp.chatbotResp,
            createdAt: new Date(),
            quickReplies: {
              type: 'radio',
              keepIt: true,
              values: resp.replies,
            },
            user: {
              _id: 2,
              name: 'chatbot',
              avatar: Styles.images.chatbotAvatar,
            },
          },
        ])
        .reverse()
        .map((messageJson, index) => {
          // console.log(messageJson, index);
          return {
            _id: index,
            text: messageJson.text,
            createdAt: messageJson.createdAt,
            quickReplies: messageJson.quickReplies,
            user: messageJson.user,
          }
        }),
    )
    if (quickReply[0].typeOf == 'in-app-link') {
      // navigation.navigate(quickReply[0].linkTo);
      if (quickReply[0].linkTo == 'iJournal') {
        navigation.navigate(stacks.iJOURNAL_STACK)
      } else if (quickReply[0].linkTo == 'iTest') {
        navigation.navigate(stacks.iTEST_STACK)
      } else if (quickReply[0].linkTo == 'AboutUs') {
        navigation.navigate(stacks.MODAL_STACK, { screen: screens.ABOUT })
      } else if (quickReply[0].linkTo == 'AWH - coming soon') {
        navigation.navigate(stacks.WELLNESS_STACK)
      } else if (quickReply[0].linkTo == 'SecondDoctorApp') {
        navigation.navigate(screens.SECONDWIND_INITIAL)
      }
    }
    if (quickReply[0].typeOf == 'other-app-link') {
      if (quickReply[0].linkTo == 'SecondDoctorApp') {
        navigation.navigate(stacks.SECONDWIND_STACK)
      }
    }
    if (quickReply[0].typeOf == 'web-link') {
      navigation.navigate(stacks.SEARCH_STACK)
    }
  }

  return (
    <Div flex={1} pt={insets.top} bg="white">
      <GDHeader
        bottomLine
        // shadow="xs"
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
            source={Styles.images.chatbotAvatar}
            w={24}
            h={24}
          />
          <Text fontSize="xl">{'챗봇'}</Text>
        </Div>
      </GDHeader>
      <GiftedChat
        messagesContainerStyle={{
          backgroundColor: Styles.colors.grayscale.white,
        }}
        onQuickReply={(quickReply) => {
          handleQuickReply(quickReply)
        }}
        renderQuickReplies={(props: any) => (
          <Div w={200} rounded="xl" p="md">
            <QuickReplies
              color={Styles.colors.grayscale.blackGray}
              quickReplyStyle={{
                backgroundColor: Styles.colors.grayscale.lighterGray,
                width: 200,
                borderColor: 'white',
              }}
              {...props}
            />
          </Div>
        )}
        // renderMessage={(props) => {
        //   Log.debug('props =', props)
        //   return (
        //     <Div
        //       style={{
        //         position: 'absolute',
        //       }}></Div>
        //   )
        // }}
        renderFooter={() => <Div h={40} />}
        locale={Config.getLang()}
        alwaysShowSend
        onInputTextChanged={(text) => setText(text)}
        renderSend={Platform.OS === 'ios' ? renderSend : undefined}
        renderBubble={renderBubble}
        renderInputToolbar={
          Platform.OS === 'ios' ? renderInputToolBar : undefined
        }
        messages={messages}
        onSend={onSend}
        renderComposer={(props) => (
          <Composer {...props} textInputStyle={{ maxHeight: 50 }} />
        )}
        maxComposerHeight={40}
        // renderMessageText={(props) => (
        //   <Div borderWidth={1}>
        //     <MessageText {...props} />
        //   </Div>
        // )}
        // inverted={false}
        user={{
          _id: 1,
        }}
      />
      {/* <KeyboardAvoidingView behavior="padding" /> */}
    </Div>
  )
}
