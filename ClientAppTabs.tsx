import * as React from 'react'
const { useState, useEffect, useContext } = React

import { StyleSheet, Image } from 'react-native'
import { Div, Text } from 'react-native-magnus'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import ClientStack from './ClientStack'
import iCareStack from './iCareStack'
import iJournalStack from './iJournalStack'
import MyPageStack from './MyPageStack'
import ChatStack from './ChatStack'

import stacks from './stacks'
import { useI18n } from '../hooks'
import { useFirestore } from 'react-redux-firebase'

import Styles from '../util/Styles'
import Log from '../util/Log'
import Config from '../config'
import { UserTypeContext } from '../context/UserTypeContext'
import { Provider, useSelector } from 'react-redux'
import ProviderMyPageStack from './providers/ProviderStack'

const Tab = createBottomTabNavigator()

const AppTabs = () => {
  const t = useI18n('navigation')
  const profile = useSelector((state: any) => state.firebase.profile)

  useEffect(() => {
    return () => {
      // cleanup
    }
  }, [])

  return (
    <Tab.Navigator
      initialRouteName={stacks.CLIENT_STACK}
      lazy={true}
      tabBarOptions={{
        showLabel: false,
      }}>
      <Tab.Screen
        name={stacks.CLIENT_STACK}
        component={ClientStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={
                  focused
                    ? Styles.images.bottomTabIcons.client.home.active
                    : Styles.images.bottomTabIcons.client.home.deactive
                }
                style={styles.tabIcons}
              />
              <Text
                py="xs"
                fontSize="xs"
                color={focused ? 'main900' : 'gray500'}>
                {t.clientBottomTabs.home}
              </Text>
            </>
          ),
        }}
      />
      {profile.purchasedAWH && (
        <Tab.Screen
          name={stacks.iCARE_STACK}
          component={iCareStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <>
                <Image
                  source={
                    focused
                      ? Styles.images.bottomTabIcons.client.iCare.active
                      : Styles.images.bottomTabIcons.client.iCare.deactive
                  }
                  style={styles.tabIcons}
                />
                <Text
                  py="xs"
                  fontSize="xs"
                  color={focused ? 'main900' : 'gray500'}>
                  {t.clientBottomTabs.iCare}
                </Text>
              </>
            ),
          }}
        />
      )}
      <Tab.Screen
        name={stacks.iJOURNAL_STACK}
        component={iJournalStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={
                  focused
                    ? Styles.images.bottomTabIcons.client.iJournal.active
                    : Styles.images.bottomTabIcons.client.iJournal.deactive
                }
                style={styles.tabIcons}
              />
              <Text
                py="xs"
                fontSize="xs"
                color={focused ? 'main900' : 'gray500'}>
                {t.clientBottomTabs.iJournal}
              </Text>
            </>
          ),
        }}
      />
      <Tab.Screen
        name={stacks.CHAT_STACK}
        component={ChatStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Div pt={5}>
              <Image
                source={
                  focused
                    ? Styles.images.bottomTabIcons.client.chat.active
                    : Styles.images.bottomTabIcons.client.chat.deactive
                }
                // style={styles.tabIconsForChatbot}
                style={styles.tabIcons}
              />
              <Text
                py="xs"
                // pb="sm"
                fontSize="xs"
                color={focused ? 'main900' : 'gray500'}>
                {t.clientBottomTabs.chat}
              </Text>
            </Div>
          ),
        }}
      />
      <Tab.Screen
        name={stacks.MYPAGE_STACK}
        component={MyPageStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={
                  focused
                    ? Styles.images.bottomTabIcons.client.myPage.active
                    : Styles.images.bottomTabIcons.client.myPage.deactive
                }
                style={styles.tabIcons}
              />
              <Text
                py="xs"
                fontSize="xs"
                color={focused ? 'main900' : 'gray500'}>
                {t.clientBottomTabs.myPage}
              </Text>
            </>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabIcons: {
    top: 5,
    height: 25,
    width: 25,
  },
  tabIconsForChatbot: {
    top: 5,
    height: 20,
    width: 20,
    paddingBottom: 5,
  },
})

export default AppTabs
