import React, { useContext } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { Button, Div, Text, Modal } from 'react-native-magnus'
import { useState, useEffect } from 'react'

// firebase
import auth, { firebase } from '@react-native-firebase/auth'

// rrf
import { useSelector } from 'react-redux'

// react-navigation
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation'

import getToken from './services/twilio/getToken'

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}
import Log from '../util/Log'
import { useFirebase } from 'react-redux-firebase'
import { UserTypeContext } from '../context/UserTypeContext'

// for Div
// Property	Description	Type	Default
// m	margin	string | number	-
// mt	margin top	string | number	-
// mr	margin right	string | number	-
// mb	margin bottom	string | number	-
// ml	margin margin left	string | number	-
// mx	margin horizonal	string | number	-
// my	margin vertical	string | number	-
// p	padding	string | number	-
// pt	padding top	string | number	-
// pr	padding right	string | number	-
// pb	padding bottom	string | number	-
// pl	padding margin left	string | number	-
// px	padding horizonal	string | number	-
// py	padding vertical	string | number	-
// h	height	number	-
// w	width	number	-
// bg	background color	string	-
// minH	mininmum height	number	-
// minW	minimum width	string	-
// bgImg	background image	ImageSourcePropType	-
// bgMode	resize mode for background image	"contain" | "cover" | "stretch"	cover
// rounded	border radius	string | number	none
// roundedTop	border radius top	string | number	none
// roundedBottom	border radius bottom	string | number	none
// roundedLeft	border radius left	string | number	none
// roundedRight	border radius right	string | number	none
// borderColor	color for border	string	-
// borderTopColor	color for border top	string	-
// borderRightColor	color for border right	string	-
// borderLeftColor	color for border left	string	-
// borderBottomColor	color for border bottom	string	-
// borderWidth	width for border	number	-
// borderTopWidth	width for border top	number	-
// borderRightWidth	width for border right	number	-
// borderLeftWidth	width for border left	number	-
// borderBottomWidth	width for border bottom	number	-
// flex	flex property for container	number	-
// row	makes flex direction to row when true	boolean	-
// shadow	describe the depth of shadow	number	-
// shadowColor	color for shadow	string	-
// justifyContent	describes how to align children within the main axis of their container	"flex-start"| "flex-end" | "center" | "space-between" | "space-around" | "space-evenly"	-
// alignItems	describes how to align children along the cross axis of their container	"flex-start" | "flex-end" | "center" | "stretch" | "baseline";	-
// flexDir	controls the direction in which children of a node are laid out	"row" | "column" | "row-reverse" | "column-reverse";	column
// flexWrap	controls what happens when children overflow the size of the container along the main axis	"wrap" | "nowrap" | "wrap-reverse";	nowrap
// position	used to position the childrens	absolute" | "relative"	relative
// top	number of logical pixels to offset the top edge of this component.	number	-
// right	number of logical pixels to offset the right edge of this component.	number	-
// bottom	number of logical pixels to offset the bottom edge of this component.	number	-
// left	number of logical pixels to offset the left edge of this component.	number	-
// opacity	opacity of div	number	-
// alignSelf	alignment for the selected item inside the flexible container.	'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'	-
// overflow	controls how children are measured and displayed	"visible" | "scroll" | "hidden"	hidden

const MyApp: React.FC<Props> = ({ navigation }: Props) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState<Boolean>(true)
  const [user, setUser] = useState<any>()
  const { userType } = useContext(UserTypeContext)

  const profile = useSelector((state: any) => state.firebase.profile)
  Log.debug('profile = ', profile)

  const firebase = useFirebase()

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user)
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber // unsubscribe on unmount
  }, [])

  if (initializing) return null

  return (
    <Div>
      <Modal isVisible={modalVisible}>
        <Button onPress={() => setModalVisible(false)}>close</Button>
      </Modal>
      <ScrollView>
        <Div m={'xl'} alignItems="center">
          {user ? (
            <Div>
              <Text>Welcome {user.email}</Text>
              <Text>You are {userType}</Text>
              <Button
                m="xl"
                alignSelf="center"
                onPress={() => firebase.logout()}>
                Logout
              </Button>
            </Div>
          ) : (
            <Div row alignItems="center" justifyContent="center">
              <Button onPress={() => navigation.navigate('login')}>
                login
              </Button>
              <Text m={'xl'}>or</Text>
              <Button onPress={() => navigation.navigate('signup')}>
                signup
              </Button>
            </Div>
          )}
        </Div>
        <Div p="xl" shadow="sm" rounded="md">
          <Button onPress={() => navigation.navigate('video-chat')}>
            Video Chat
          </Button>
          <Button onPress={() => navigation.navigate('find-provider')}>
            Video Chat
          </Button>
          <Button onPress={() => setModalVisible(true)}>ModalOpen</Button>
          <Text
            fontSize="lg"
            fontWeight="bold"
            textTransform="uppercase"
            color="red400"
            letterSpacing={2}
            mt="lg">
            Best Seller
          </Text>
          <Text textAlign="center">This is a Div</Text>
          <Text textAlign="center">Background Colors</Text>
          <Div h={40} w={40} bg="pink500" />
          <Div h={40} w={40} bg="green500" />
          <Div h={40} w={40} bg="teal500" />
          <Div h={40} w={40} bg="yellow500" />
          <Div h={40} w={40} bg="red500" />
          <Div h={40} w={40} bg="blue500" />
          <Div h={40} w={40} bg="gray500" />
          <Text textAlign="center">Borders</Text>
          <Div
            h={40}
            w={40}
            bg="green200"
            borderColor="green500"
            borderWidth={1}
          />
          <Div
            h={40}
            w={40}
            bg="yellow200"
            borderColor="yellow500"
            borderWidth={1}
          />
          <Div h={40} w={40} bg="red200" borderColor="red500" borderWidth={1} />
          <Div
            h={40}
            w={40}
            bg="blue200"
            borderColor="blue500"
            borderWidth={1}
          />
          <Div
            h={40}
            w={40}
            bg="gray200"
            borderColor="gray500"
            borderWidth={1}
          />
          <Text textAlign="center">Shadows</Text>
          <Div h={40} w={40} rounded="md" bg="gray500" shadow="xs" />
          <Div h={40} w={40} rounded="md" bg="gray500" shadow="sm" />
          <Div h={40} w={40} rounded="md" bg="gray500" shadow="md" />
          <Div h={40} w={40} rounded="md" bg="gray500" shadow="lg" />
          <Div h={40} w={40} rounded="md" bg="gray500" shadow="xl" />
          <Div h={40} w={40} rounded="md" bg="gray500" shadow="2xl" />
          <Text textAlign="center">Border Radius</Text>
          <Div h={40} w={40} bg="teal500" />
          <Div h={40} w={40} bg="teal500" rounded="sm" />
          <Div h={40} w={40} bg="teal500" rounded="md" />
          <Div h={40} w={40} bg="teal500" rounded="lg" />
          <Div h={40} w={40} bg="teal500" rounded="xl" />
          <Text textAlign="center">Flex</Text>
          <Div row m="xl">
            <Div h={40} flex={3} bg="red500" />
            <Div h={40} flex={1} mx="sm" bg="yellow500" />
            <Div h={40} flex={2} bg="green500" />
          </Div>
          <Text textAlign="center">Example #1</Text>
          <Div m="xl">
            <Div>
              <Div
                rounded="xl"
                h={150}
                bgImg={{
                  uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
                }}>
                <Div
                  bg="pink500"
                  rounded="md"
                  row
                  flexWrap="wrap"
                  px="md"
                  m="lg"
                  alignSelf="flex-start">
                  <Text color="white" fontSize="sm">
                    2 Rooms
                  </Text>
                </Div>
              </Div>
              <Div row alignItems="center">
                <Div flex={1}>
                  <Text fontWeight="bold" fontSize="xl" mt="sm">
                    Sunny Apartment
                  </Text>
                  <Text color="gray500" fontSize="sm">
                    Gurgoan, India
                  </Text>
                </Div>
                <Div row alignItems="center">
                  <Text color="blue500" fontWeight="bold" fontSize="xl">
                    $500
                  </Text>
                  <Text color="gray500" ml="md">
                    / per day
                  </Text>
                </Div>
              </Div>
            </Div>
          </Div>
        </Div>
      </ScrollView>
    </Div>
  )
}

export default MyApp
