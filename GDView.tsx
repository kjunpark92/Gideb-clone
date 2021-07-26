import * as React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { Div } from 'react-native-magnus'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Styles from '../util/Styles'
import GDHeader from './GDHeader'

interface GDViewProps {
  children: React.ReactNode
  headerText: any
}

const GDView: React.FC<GDViewProps> = ({ children, headerText }) => {
  const insets = useSafeAreaInsets()
  return (
    <Div
      style={{ backgroundColor: Styles.colors.background.light, flex: 1 }}
      pt={insets.top}>
      <GDHeader>{headerText}</GDHeader>
      <Div p="lg">{children}</Div>
    </Div>
  )
}

export default GDView
