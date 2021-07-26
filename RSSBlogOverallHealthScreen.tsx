// NEED TO FIX FONTS
import * as React from 'react'
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Dimensions,
  Platform,
  // ActivityIndicator,
} from 'react-native'
import { Div, Text, Button, Image, Modal } from 'react-native-magnus'
import dayjs from 'dayjs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import BlogsService from '../services/blogs'
import Log from '../util/Log'
import Styles from '../util/Styles'
import { GDHeader, GDFontText } from '../components'

import { WebView } from 'react-native-webview'

interface OverallHealthBlogScreenProps {}

interface BlogPostProps {
  title: string
  description: string
  pubDate: string
  category: string
  author: string
  link: string
}

const STATIC_BLOGS = [
  {
    img: Styles.images.blogs.workStress,
    title: '직장인 스트레스 알아보기',
    desc: `직무와 관련된 스트레스 요인에 의해 경험하게 되는 스트레스를 의미한다.\n직무 스트레스는 직무와 관련하여 조직...`,
    year: '2021',
    link: 'https://blog.naver.com/iamgideb/222429168206',
  },
  {
    img: Styles.images.blogs.emotionalLabor,
    title: '감정노동 알아보기',
    desc: `은행원・승무원・전화상담원처럼 직접 고\n객을 응대하면서 자신의 감정은 드러내지 \n않고 서비스해야하는 직업상 속내를 감...`,
    year: '2021',
    link: 'https://blog.naver.com/iamgideb/222429166222',
  },
  {
    img: Styles.images.blogs.depressionQuestion,
    title: '항우울제 알아보기',
    desc: `항우울제는 우울증 치료에 사용되는 약물\n이다. 뇌에서 기분에 관련된 신경전달물질\n들의 불균형을 조절하여 우울증을 완화...`,
    year: '2021',
    link: 'https://blog.naver.com/iamgideb/222429164576',
  },
  {
    img: Styles.images.blogs.OCD,
    title: '강박장애 알아보기',
    desc: `강박장애란 지속적이고 통제가 불가능한 \n생각(강박관념)이 마음속에 가득차거나 고\n통스럽고 일상생활의 기능을 방해하는...`,
    year: '2021',
    link: 'https://blog.naver.com/iamgideb/222429162972',
  },
  {
    img: Styles.images.blogs.alcoholic,
    title: '알코올 중독 알아보기',
    desc: `세계보건기구는 2010년 보고서를 통해 위\n해 해로운 음주(harmful use of alcohol)\n를 건강에 악영향을 미치는 중요요소로...`,
    year: '2021',
    link: 'https://blog.naver.com/iamgideb/222429161783',
  },
]

const SCREEN_HEIGHT = Dimensions.get('screen').height
const { useEffect, useState } = React
const OverallHealthBlogScreen: React.FC<OverallHealthBlogScreenProps> =
  ({}) => {
    const [blogsToShow, setBlogsToShow] = useState([])
    const [isLoaded, setIsLoaded] = useState(true)
    const insets = useSafeAreaInsets()

    const getBlogsAndSetState = async () => {
      const blogs = await BlogsService.getAllBlogs()
      Log.debug('blogs**', blogs)
      setBlogsToShow(blogs)
      setIsLoaded(false)
    }

    useEffect(() => {
      // getBlogsAndSetState()
    }, [])

    const BlogPost: React.FC<BlogPostProps> = ({
      title,
      description,
      pubDate,
      category,
      author,
      link,
    }) => (
      <TouchableOpacity onPress={() => Linking.openURL(link)}>
        <Div mx="xl" my="lg">
          <Div>
            <Div>
              <Div flex={1}>
                <GDFontText textWeight="bold" fontSize="xl" mt="sm">
                  {title}
                </GDFontText>
                <Div p="sm" />
                <Text color="gray500" fontSize="sm">
                  {description}
                </Text>
              </Div>
              <Div pt="xs" />
              <Div>
                <GDFontText color="blue500" textWeight="bold" fontSize="xl">
                  {author}
                </GDFontText>
              </Div>
              <Div pt="xs" />
              <Div>
                <GDFontText color="blue500" textWeight="bold" fontSize="xl">
                  {category}
                </GDFontText>
              </Div>
              <Div pt="xs" />

              <Div>
                <Text color="gray500">
                  {dayjs(pubDate).format('YYYY.MM.DD')}
                </Text>
              </Div>
            </Div>
          </Div>
        </Div>
      </TouchableOpacity>
    )

    // const [showWebView, setShowWebView] = useState(false)
    const StaticBlogPosts = ({ link, img, title, desc, year }) => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              // setShowWebView(true)
              Linking.openURL(link)
            }}>
            <Div row>
              <Div>
                <Image source={img} h={120} w={120} resizeMode="contain" />
              </Div>
              <Div p="md" flexWrap="wrap">
                <GDFontText fontSize={16} textWeight="bold">
                  {title}
                </GDFontText>
                <Text fontSize={12} color="gray500" w={240}>
                  {desc}
                </Text>
                <Div p="sm" />
                <Text color="gray500">{year}년</Text>
              </Div>
            </Div>
          </TouchableOpacity>
          {/* <Modal h="100%" isVisible={showWebView}>
            <Div flex={1}>
              <ScrollView bounces={false}>
                <WebView
                  style={{
                    height: 500,
                    width: 500,
                  }}
                  // ref={webview}
                  source={{ uri: link }}
                  // useWebKit={false} // Stupid Korean cookies loving finance websites.
                  // onShouldStartLoadWithRequest={onNavigationStateChange}  // Not called on first load for Android
                  // onNavigationStateChange={handleWebViewNavigationStateChange}
                  // failure={failure}
                  // sharedCookiesEnabled={true}
                />
                <Button onPress={() => setShowWebView(false)} />
              </ScrollView>
            </Div>
          </Modal> */}
        </>
      )
    }

    return (
      <Div flex={1} pt={insets.top} bg="white">
        <GDHeader bottomLine>건강정보</GDHeader>
        <Div bg="transparent" p="md">
          <FlatList
            data={STATIC_BLOGS}
            style={{ height: SCREEN_HEIGHT - 210, paddingTop: 16 }}
            bounces={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            ItemSeparatorComponent={() => <Div p="sm" />}
            renderItem={({ item: { link, img, title, desc, year } }) => (
              // <BlogPost
              //   title={title}
              //   description={description}
              //   pubDate={pubDate}
              //   category={category}
              //   author={author}
              //   link={link[0]}
              // />
              <StaticBlogPosts
                link={link}
                img={img}
                title={title}
                desc={desc}
                year={year}
              />
            )}
            keyExtractor={(item, i) => String(i)}
          />
        </Div>

        {Platform.OS == 'android' ? (
          <Div position="absolute" bottom={0}>
            <Button
              h={48}
              block
              rounded="none"
              onPress={() => Linking.openURL('https://blog.naver.com/iamgideb')}
              py="xl"
              bg="main900">
              {'기댑 블로그로 바로가기'}
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
              onPress={() => Linking.openURL('https://blog.naver.com/iamgideb')}
              // py="xl"
              bg="main900"
              fontSize="lg">
              {'기댑 블로그로 바로가기'}
            </Button>
          </Div>
        )}
      </Div>
      //   )}
      // </>
    )
  }

const styles = StyleSheet.create({})

export default OverallHealthBlogScreen
