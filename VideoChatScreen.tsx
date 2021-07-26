import * as React from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  Modal as RNModal,
} from 'react-native'
import {
  Div,
  Text,
  Icon,
  Input,
  Button,
  Header,
  Modal,
} from 'react-native-magnus'
import CustomWebView from '../util/CustomWebView'
import {
  // is responsible for connecting to rooms, events delivery and camera/audio
  TwilioVideo,
  // is responsible local camera feed video
  TwilioVideoLocalView,
  // is responsible remote peer's camera feed video
  TwilioVideoParticipantView,
} from 'react-native-twilio-video-webrtc'
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { GiftedChat } from 'react-native-gifted-chat'
import dayjs from 'dayjs'
import { Timer } from 'react-native-stopwatch-timer'
import { useTimer } from 'react-timer-hook'

import Log from '../util/Log'
import Styles from '../util/Styles'
import TwilioService from '../services/twilio'
import { UserTypeContext } from '../context/UserTypeContext'
import { GDHeader } from '../components'
import { GDTimer } from '../components/GDTimer'
import { GDActivityView } from '../components/GDActivityView'

interface VideoChatScreenProps {
  navigation: any
}

const { useEffect, useRef, useState, useContext, useCallback, useMemo } = React
const VideoChatScreen: React.FC<VideoChatScreenProps> = ({ navigation }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [status, setStatus] = useState('connecting')
  // const [participants, setParticipants] = useState(new Map())
  const [videoTracks, setVideoTracks] = useState<Array>([])
  // const [token, setToken] = useState('')
  // const [isButtonDisplay, setIsButtonDisplay] = useState(true)
  const [personName, setPersonName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [fullScreenSelected, setFullScreenSelected] = useState(null)
  const [activityModalVisible, setActivityModalVisible] = useState(false)
  const [messages, setMessages] = useState([])
  const [groupChatModalVisible, setGroupChatModalVisible] = useState(false)

  const firebase = useFirebase()
  const profile = useSelector((state: any) => state.firebase.profile)
  const twilioRef = useRef(null)
  const { userType } = useContext(UserTypeContext)
  const webview = useRef(null)
  const { videoChatId } = useSelector((state) => state.WT)

  useFirestoreConnect({
    collection: 'awhSessions',
    doc: videoChatId,
  })

  const awhSession = useSelector(
    ({ firestore: { data } }) =>
      data.awhSessions && data.awhSessions[videoChatId],
  )

  console.log('awhSession = ', awhSession)

  useEffect(() => {
    if (awhSession) {
      setActivityModalVisible(awhSession.isActivityOn)
    }
    return () => {
      // cleanup
    }
  }, [awhSession])

  let typingCurrentWord = ''

  // const wordsList = useMemo(
  //   () => setWordsToDisplay([...wordsToDisplay, typingCurrentWord]),
  //   [typingCurrentWord],
  // )

  // Log.debug('videoChatId =', videoChatId)

  async function GetAllPermissions() {
    // it will ask the permission for user
    try {
      if (Platform.OS === 'android') {
        const userResponse = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ])
        return userResponse
      }
    } catch (err) {
      console.log(err)
    }
    return null
  }

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    Log.debug('onParticipantRemovedVideoTrack:', participant, track)
    const videoTracksLocal = videoTracks

    setVideoTracks(videoTracksLocal)
  }

  useEffect(() => {
    GetAllPermissions()
    Log.debug('userTypeContext:', userType)
    Log.debug('twilio access creds =', profile.nickname, videoChatId)

    // if (roomName != '') {
    TwilioService.getToken(profile.nickname, videoChatId).then(
      (accessToken) => {
        twilioRef.current.connect({ accessToken })
      },
    )
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
    // }
  }, [])

  const connectToRoomPressed = () => {
    setStatus('connecting')
    // profile.nickname
    // if (roomName != '') {
    TwilioService.getToken(profile.nickname, videoChatId).then(
      (accessToken) => {
        twilioRef.current.connect({ accessToken })
      },
    )
    // }
  }

  const roomConnectedSuccess = () => setStatus('connected')

  const roomConnectEnd = () => setStatus('disconnected')

  // {"track":{"trackName":"A3FcB8f2a0CAbbadbd23Cdec2Fba48aC",
  // "enabled":false,"trackSid":"MTb4e6b5dbedfab20753a6898b5fef35e8"},
  // "participant":{"identity":"12","sid":"PA36c823cdee4ee658481c876a54dff7e2"}}

  const participantAdded = ({ participant, track }) => {
    Log.debug('participant added:', participant, track)
    const addedTrack = {
      participantSid: participant.sid,
      videoTrackSid: track.trackSid,
    }
    setVideoTracks([...videoTracks, addedTrack])
  }

  const participantRemoved = ({ participant, track }) => {
    const participantRemovedFromTracks = videoTracks
    Log.debug('videoTracks before delete:', videoTracks, videoTracks.length)
    setVideoTracks(
      participantRemovedFromTracks.filter(
        (participantIn) => participantIn.participantSid != participant.sid,
      ),
    )
    Log.debug('videoTracks after delete:', videoTracks, videoTracks.length)
  }

  const roomLeave = () => {
    twilioRef.current.disconnect()
    navigation.goBack()
  }

  const handleMicButton = () =>
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled))

  const handleFlipCamera = () => twilioRef.current.flipCamera()

  const handleParticipantFullScreen = (idx) => {
    Log.debug(idx)
    if (fullScreenSelected) return setFullScreenSelected(null)
    return setFullScreenSelected(idx)
  }

  const videoChatStyle = (fullScreen) => {
    Log.debug(fullScreenSelected)
    Log.debug('fullScreen =', fullScreen)
    Log.debug(styles.selectedVideoView, styles.studentVideoView)
    if (fullScreen) return styles.selectedVideoView
    return styles.studentVideoView
  }

  const startActivity = () => {
    setActivityModalVisible(true)
  }

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  const GroupChatModal = ({ visible }) => {
    return (
      <RNModal visible={visible}>
        <Div style={{ flex: 1 }}>
          <Button
            onPress={() => setGroupChatModalVisible(!groupChatModalVisible)}>
            CLOSE
          </Button>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: 1,
            }}
          />
        </Div>
      </RNModal>
    )
  }

  return (
    <>
      <GroupChatModal visible={groupChatModalVisible} />
      {/* <ActivityModal
        visible={activityModalVisible}
        headerText={currentActivityHeaderText}
        questionText={currentQuestionText}
      /> */}
      <Div style={{ flex: 1, backgroundColor: Styles.colors.background.light }}>
        {status == 'disconnected' && (
          <Div p="lg">
            <Input
              placeholder="user name"
              p="lg"
              focusBorderColor="blue700"
              // suffix={
              //   <Icon name="connect" color="gray900" fontFamily="Feather" />
              // }
              onChangeText={setPersonName}
            />
            <Input
              placeholder="Room name"
              p="lg"
              focusBorderColor="blue700"
              // suffix={
              //   <Icon name="connect" color="gray900" fontFamily="Feather" />
              // }
              onChangeText={setRoomName}
            />
            <Div p="lg" />
            <Button
              block
              onPress={connectToRoomPressed}
              disabled={roomName == ''}>
              Enter Room
            </Button>
          </Div>
        )}
        {status == 'connecting' && (
          <Div alignItems="center" justifyContent="center" flex={1}>
            <Text>call is connecting ...</Text>
            <ActivityIndicator size="large" />
          </Div>
        )}
        {status == 'connected' && (
          <Div>
            <Div p="xl" />
            <Div row justifyContent="space-between" px="xl">
              <Text fontSize="3xl" fontWeight="bold">
                {videoTracks.length + 1} 명 참여중
              </Text>
              <Div row>
                <TouchableOpacity onPress={handleFlipCamera}>
                  <Icon
                    fontFamily="MaterialIcons"
                    name="refresh"
                    fontSize="6xl"
                  />
                </TouchableOpacity>
                <Div p="lg" />
                <TouchableOpacity onPress={roomLeave}>
                  <Icon
                    fontFamily="MaterialIcons"
                    name="exit-to-app"
                    fontSize="6xl"
                  />
                </TouchableOpacity>
              </Div>
            </Div>
            <TwilioVideoLocalView enabled={true} style={styles.fullVideoView} />
            <Div row position="absolute" bottom={200} w="100%">
              {videoTracks.map((videoTrack, i) => {
                // Log.debug('videoTracks: map:', videoTrack)

                return (
                  <TouchableOpacity
                    disabled={i == fullScreenSelected}
                    style={videoChatStyle(i == fullScreenSelected)}
                    onPress={() =>
                      handleParticipantFullScreen(fullScreenSelected ? null : i)
                    }
                    key={String(i)}>
                    {i == fullScreenSelected && (
                      <TouchableOpacity
                        onPress={() => setFullScreenSelected(null)}
                        style={{
                          position: 'absolute',
                          top: 50,
                          right: 50,
                          zIndex: 10,
                        }}>
                        <Icon
                          fontFamily="MaterialCommunityIcons"
                          name="close"
                          color="black"
                          fontSize="4xl"
                        />
                      </TouchableOpacity>
                    )}
                    <TwilioVideoParticipantView
                      style={videoChatStyle(i == fullScreenSelected)}
                      trackIdentifier={videoTrack}
                    />
                  </TouchableOpacity>
                )
              })}
            </Div>
            <Div
              row
              p="lg"
              position="absolute"
              justifyContent="space-around"
              // borderWidth={1}
              w="100%"
              bottom={100}>
              <TouchableOpacity onPress={handleMicButton}>
                <Icon
                  rounded="xl"
                  bg="white"
                  name={isAudioEnabled ? 'microphone-off' : 'microphone'}
                  fontFamily="MaterialCommunityIcons"
                  fontSize="6xl"
                  color="gray400"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={startActivity}>
                <Icon
                  rounded="xl"
                  bg="white"
                  name="clipboard-outline"
                  fontFamily="MaterialCommunityIcons"
                  fontSize="6xl"
                  color="gray400"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setGroupChatModalVisible(!groupChatModalVisible)
                  Log.debug('GO TO CHAT **')
                }}>
                <Icon
                  rounded="xl"
                  bg="white"
                  name="chat"
                  fontFamily="MaterialIcons"
                  fontSize="6xl"
                  color="gray400"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Log.debug('RAISE HAND ** PROBALBY UNMUTE')}>
                <Icon
                  rounded="xl"
                  bg="white"
                  name="hand-right"
                  fontFamily="MaterialCommunityIcons"
                  fontSize="6xl"
                  color="gray400"
                />
              </TouchableOpacity>
            </Div>
          </Div>
        )}

        <RNModal visible={activityModalVisible}>
          <GDActivityView
            closeActivity={() => setActivityModalVisible(false)}
          />
        </RNModal>

        <TwilioVideo
          ref={twilioRef}
          onRoomDidConnect={roomConnectedSuccess}
          onRoomDidDisconnect={roomConnectEnd}
          onRoomDidFailToConnect={roomConnectEnd}
          onParticipantAddedVideoTrack={participantAdded}
          onParticipantRemovedVideoTrack={participantRemoved}
        />
      </Div>
    </>
  )
}

const styles = StyleSheet.create({
  localVideoView: {
    height: 50,
    width: 50,
  },
  participantVideoVideo: {
    height: 100,
    width: 100,
    // borderWidth: 1,
  },
  fullVideoView: {
    height: '100%',
    width: '100%',
    // borderWidth: 1,
  },
  studentVideoView: {
    height: 100,
    width: 100,
    // borderWidth: 1,
  },
  selectedVideoView: {
    height: 600,
    width: 400,
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
})

export default VideoChatScreen
