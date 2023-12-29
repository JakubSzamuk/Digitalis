import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Color, StandardBackground } from '../../../constants/colors'
import { UtilityStyles } from '../../../styles/utility'
import { CaretLeft } from 'phosphor-react-native'
import { FontStyles } from '../../../styles/text'
import useWebSocketStore from '../../../stores/Websocket'
import useContactsStore from '../../../stores/Contacts'

// const ChatMessage = () => {
//   return (

//   )
// }

type ChatMessage = {
  id: string,
  message_body: string,
  sender_id: string,
  recipient_id: string,
  time: string,
  message_key_range: string,
}

const Message = ({ message, recipient }: { message: ChatMessage, recipient: string}) => {
  return (
    <View style={{ elevation: 20, shadowColor: Color.primary, marginBottom: 8, maxWidth: "80%" }}>
      <StandardBackground style={{ backgroundColor: '#00000030', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
        <View style={{ paddingVertical: 4, paddingHorizontal: 6 }}>
          <Text style={FontStyles.StandardText}>{message.message_body}</Text>
          <Text style={[FontStyles.ExtraSmall, { marginLeft: 'auto' }]}>{message.time.split(" ")[1]}</Text>
        </View>
      </StandardBackground>
      <View style={{ borderBottomRightRadius: 8, backgroundColor: '#00000030', height: 8, width: 12 }}></View>
    </View>
  )
}

const Chat = ({ route, navigation }) => {

  const { socket, subscribeToSocket } = useWebSocketStore((state) => state);
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const { getContact } = useContactsStore((state) => state);
  
  let contact = getContact(route.params.recipient_id);
  console.log(contact)

  useEffect(() => {
    subscribeToSocket(message_reciever);
  }, [])  

  const message_reciever = (message: string) => {
    setMessages(prev => [...prev, (JSON.parse(message.data) as ChatMessage)])
  };
  useEffect(() => {    
    socket.send(JSON.stringify({ "new_recipient_id": route.params.recipient_id }))
  }, [])


  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop: 18 }}>
          <TouchableOpacity onPress={() => navigation.navigate("home")}>
            <CaretLeft color={Color.text} size={48} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
            <View style={{ backgroundColor: Color.secondary, width: 76, height: 76, borderRadius: 4, elevation: 20, shadowColor: Color.secondary }}></View>
            <View style={{ marginLeft: 8 }}>
              <Text style={FontStyles.Header}>Jakub Szamuk</Text>
              <Text style={FontStyles.StandardText}>100 Messages Left</Text>
            </View>
          </View>
        </View>
        <StandardBackground withBorder style={{ borderRadius: 10, marginTop: 10 }}>
          <ScrollView 
            style={{ width: "100%", height: "100%", paddingHorizontal: 16, paddingTop: 8 }}
            ref={ref => {this.scrollView = ref}}
            onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
          >
            <FlatList 
              data={messages}
              renderItem={({ item }) => <Message recipient={route.params.recipient_id} message={item} />}
              keyExtractor={(item) => item.id}
            />
          </ScrollView>
        </StandardBackground>
      </StandardBackground>
    </SafeAreaView>
  )
}

export default Chat