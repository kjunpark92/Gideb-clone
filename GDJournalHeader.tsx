import * as React from 'react'
import { Header, Button, Icon, Text } from 'react-native-magnus'
import { useNavigation } from '@react-navigation/native'
import { GDFontText } from '.'

interface GDJournalHeaderProps {
  suffixFunction?: () => void
  headerText: String
}

const GDJournalHeader: React.FC<GDJournalHeaderProps> = ({
  suffixFunction = false,
  headerText,
}) => {
  const navigation = useNavigation()
  return (
    <Header
      shadow="none"
      alignment="center"
      fontSize="xl"
      prefix={
        <Button bg="transparent" onPress={() => navigation.goBack()}>
          <Icon
            name="chevron-left"
            fontFamily="Entypo"
            fontSize="3xl"
            color="gray900"
          />
        </Button>
      }
      suffix={
        suffixFunction && (
          <Button bg="transparent" onPress={suffixFunction}>
            <Icon
              name="more-vertical"
              fontFamily="Feather"
              fontSize="3xl"
              color="black"
            />
          </Button>
        )
      }>
      <GDFontText fontSize="3xl">{headerText}</GDFontText>
    </Header>
  )
}

export default GDJournalHeader
