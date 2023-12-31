import { View, Text, TouchableOpacity, FlatList, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Color, StandardBackground } from '../../../constants/colors'
import { UtilityStyles } from '../../../styles/utility'
import { CaretLeft, CellSignalNone, ChatCentered, PaperPlaneTilt, Plus } from 'phosphor-react-native'
import { FontStyles } from '../../../styles/text'
import useWebSocketStore from '../../../stores/Websocket'
import useContactsStore from '../../../stores/Contacts'
import LinearGradient from 'react-native-linear-gradient'

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


  const message_reciever = (message) => {
    console.log(message)
    message = JSON.parse(message.data) as ChatMessage | ChatMessage[];
    if (Array.isArray(message)) {
      setMessages(prev => [...prev, ...message])
    } else {
      setMessages(prev => [...prev, message])
    }
  };

  useEffect(() => {    
    subscribeToSocket(message_reciever);
    socket.onmessage = message_reciever;
    socket.send(JSON.stringify({ "new_recipient_id": route.params.recipient_id, "up_to": 10 }))
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
        <KeyboardAvoidingView behavior='position' style={{ marginTop: 10 }}>
          <StandardBackground withBorder style={{ borderRadius: 10 }}>
            <ScrollView
              style={{ width: "100%", paddingHorizontal: 16, paddingTop: 8, marginBottom: 120 }}
              ref={ref => {this.scrollView = ref}}
              onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
            >
              <View>
                <FlatList
                  data={messages}
                  renderItem={({ item }) => <Message recipient={route.params.recipient_id} message={item} />}
                  keyExtractor={(item) => item.id}
                />
              </View>
            </ScrollView>
            <View style={{ elevation: 20, shadowColor: Color.primary, borderRadius: 80, overflow: 'hidden', bottom: 20, position: 'absolute' }}>
              <StandardBackground>
                <View style={{ flexDirection: 'row', paddingVertical: 6, paddingLeft: 20, paddingRight: 6, alignItems: 'center' }}>
                  <TextInput style={[FontStyles.StandardText, { width: "80%" }]} placeholder='Message' multiline placeholderTextColor={Color.primary} />
                  <TouchableOpacity onPress={() => {}}>
                    <LinearGradient
                      colors={["#F3F3F3", "#575B5C"]}
                      style={{ borderRadius: 100, height: 72, width: 72, padding: 4 }}
                    >
                      <LinearGradient 
                        colors={["#ABACAC", "#949494"]}
                        style={{ borderRadius: 100, height: "100%", width: "100%", alignItems: 'center', justifyContent: 'center' }}
                      >
                        <PaperPlaneTilt color="#252525" size={32} />
                      </LinearGradient>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </StandardBackground>
            </View>
          </StandardBackground>
        </KeyboardAvoidingView>
      </StandardBackground>
    </SafeAreaView>
  )
}

export default Chat