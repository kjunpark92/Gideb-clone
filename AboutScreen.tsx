import * as React from 'react'
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import { Div, Text, Image, Icon, Button, Modal } from 'react-native-magnus'
import { GDHeader, GDFontText } from '../components'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useI18n } from '../hooks'
import YouTube from 'react-native-youtube'
import screens from '../navigation/screens'
import Styles from '../util/Styles'
import Log from '../util/Log'
import { WebView } from 'react-native-webview'

const { useEffect, useState, useRef } = React
interface AboutScreenProps {}

// the picture on top is too big and button on bottom needs to be conditionally rendered by platform like others [ secondwind, AWH ]
const AboutScreen: React.FC<AboutScreenProps> = () => {
  const [showBrowser, setShowBrowser] = useState(false)
  const t = useI18n('about')
  const insets = useSafeAreaInsets()
  // const webview = useRef(null)

  const handleWebViewNavigationStateChange = (newNavState) => {
    Log.debug('handleWebViewNavigationStateChange', newNavState)
    // const { url } = newNavState
    // if (!url) return
    // Log.debug(
    //   'CustomWebView: handleWebViewNavigationStateChange: newNavState:',
    //   newNavState,
    //   url,
    // )
    // if (url.includes('?priinfo=')) {
    //   axios
    //     .get(url)
    //     .then((res) => {
    //       Log.debug('CustomWebView: ONRESULT:', res.data)
    //       setUser({
    //         ...user,
    //         passAppData: res.data,
    //       })
    //       setModalVisible(false)
    //       setValidity({ ...validity, passAppChecked: true })
    //       Log.debug('AFTER PHONE VERIFICATION:', user)
    //     })
    //     .catch((err) => Log.debug('ERROR:', err))
    // }
  }

  return (
    <Div flex={1} bg="white" pt={insets.top}>
      <Modal isVisible={showBrowser}>
        <TouchableOpacity onPress={() => setShowBrowser(false)}>
          <Div bg="main900">
            <Icon
              alignSelf="flex-end"
              fontFamily="MaterialCommunityIcons"
              name="close"
              fontSize="4xl"
              color="white"
              p="lg"
            />
          </Div>
        </TouchableOpacity>
        <Div flex={1}>
          <WebView
            // ref={webview}
            source={{ uri: 'https://gideb.com' }}
            // useWebKit={false} // Stupid Korean cookies loving finance websites.
            // onShouldStartLoadWithRequest={onNavigationStateChange}  // Not called on first load for Android
            // onNavigationStateChange={handleWebViewNavigationStateChange}
            // failure={failure}
            // sharedCookiesEnabled={true}
          />
        </Div>
      </Modal>
      <GDHeader>{t.title}</GDHeader>
      <Div borderBottomWidth={1} borderBottomColor="gray200" />
      <ScrollView bounces={false}>
        <Div
          flex={1}
          bgImg={Styles.images.about.group}
          bgMode="cover"
          pl="xl"
          py="2xl">
          <Div py={40}>
            <GDFontText fontSize="lg" color="main900" textWeight="300">
              {t.pic1top}
            </GDFontText>
            <GDFontText fontSize="4xl" color="gray900" mt="lg" textWeight="700">
              {t.pic1bott}
            </GDFontText>
          </Div>
        </Div>
        <Div flex={1} bg="background" px="xl" pb="3xl">
          <GDFontText fontSize="3xl" mt="2xl" textWeight="700">
            {t.p1_title}
          </GDFontText>
          <Text fontSize="lg" mt="xl" pb="xl">
            {t.p1_text}
          </Text>
          <Div row alignItems="center">
            <Div flex={1} ml="lg" mr="2xl" alignItems="center">
              <Image source={Styles.images.about.whole_eye} h={65} w={65} />
            </Div>
            <Div flex={5}>
              <Div>
                <GDFontText fontSize="2xl" mt="2xl" textWeight="700">
                  {t.p2_title}
                </GDFontText>
              </Div>
              <Div>
                <Text fontSize="lg" mt="xl" pb="2xl">
                  {t.p2_text}
                </Text>
              </Div>
            </Div>
          </Div>
          <Div row alignItems="center">
            <Div flex={1} alignItems="center" ml="lg" mr="2xl">
              <Image source={Styles.images.about.target} h={65} w={65} />
            </Div>
            <Div flex={5}>
              <GDFontText fontSize="2xl" mt="2xl" textWeight="700">
                {t.p3_title}
              </GDFontText>
              <Text fontSize="lg" mt="xl" pb="2xl">
                {t.p3_text}
              </Text>
            </Div>
          </Div>

          <Div
            pt="2xl"
            // style={{ overflow: 'hidden', height: 350, width: '100%' }}
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor={Styles.colors.grayscale.lightGray}>
            <GDFontText fontSize="3xl" mb="lg" textWeight="700">
              {t.p4_title}
            </GDFontText>
            <YouTube
              videoId="OQHRpY1-9l4" // The YouTube video ID
              apiKey="AIzaSyB4Zwx7C_zgTXlt9dZh7z84pLRypipdxSk"
              style={{ alignSelf: 'stretch', height: 300 }}
            />
          </Div>

          <Div
            pt="2xl"
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor={Styles.colors.grayscale.lightGray}
          />
          <Div mt="2xl">
            <GDFontText fontSize="2xl" textWeight="700">
              {t.p5_title}
            </GDFontText>
            <Div row mt="xl" style={styles.logo}>
              <Div flex={1} alignItems="center">
                <Image
                  source={Styles.images.about.logo_naaphima}
                  resizeMode="contain"
                  h={40}
                  w={154}
                />
              </Div>
              <Div flex={1} alignItems="center">
                <Image source={Styles.images.about.logo_hbic} h={53} w={70} />
              </Div>
            </Div>
            <Div style={styles.logo} mt="xl">
              <Div flex={1} alignItems="center">
                <Image
                  source={Styles.images.about.logo_mediplus}
                  h={50}
                  w={127}
                />
              </Div>
              <Div flex={1} alignItems="center">
                <Image
                  source={Styles.images.about.logo_innovators}
                  h={48}
                  w={67}
                />
              </Div>
            </Div>
            <Div style={styles.logo} mt="xl">
              <Div flex={1} alignItems="center">
                <Image source={Styles.images.about.logo_wb} h={57} w={70} />
              </Div>
              <Div flex={1} alignItems="center">
                <Image
                  source={Styles.images.about.logo_ministry}
                  h={56}
                  w={51}
                />
              </Div>
            </Div>
            {/* <Div style={styles.logo} mt="xl">
              <Div flex={1} alignItems="center">
                <Image
                  source={Styles.images.about.logo_seconds}
                  h={58}
                  w={59}
                />
              </Div>
              <Div flex={1} alignItems="center">
                <Image
                  source={Styles.images.about.logo_association}
                  h={30}
                  w={160}
                />
              </Div>
            </Div> */}
          </Div>
        </Div>
      </ScrollView>
      {/* <Button
        onPress={() => setShowBrowser(true)}
        block
        bg="main900"
        py="xl"
        position="relative"
        bottom={0}>
        <GDFontText fontSize="lg" color="white">
          {t.button}
        </GDFontText>
      </Button> */}

      {Platform.OS == 'android' ? (
        <Div position="absolute" bottom={0}>
          <Button
            h={48}
            block
            rounded="none"
            onPress={() => setShowBrowser(true)}
            py="xl"
            bg="main900">
            {t.button}
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
            onPress={() => setShowBrowser(true)}
            // py="xl"
            bg="main900"
            fontSize="lg">
            {t.button}
          </Button>
        </Div>
      )}
    </Div>
  )
}

const styles = StyleSheet.create({
  banner_img: {
    width: '100%',
    // Without height undefined it won't work
    height: undefined,
    aspectRatio: 375 / 213,
    marginHorizontal: 0,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyelashes: {
    height: 12,
    width: 5,
    marginHorizontal: 4,
  },
})

export default AboutScreen
