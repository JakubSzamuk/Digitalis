import { View, Text, TouchableOpacity, FlatList, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Color, StandardBackground } from '../../../constants/colors'
import { UtilityStyles } from '../../../styles/utility'
import { CaretLeft, CellSignalNone, ChatCentered, PaperPlaneTilt, Plus } from 'phosphor-react-native'
import { FontStyles } from '../../../styles/text'
import useWebSocketStore from '../../../stores/Websocket'
import useContactsStore, { StoredContact } from '../../../stores/Contacts'
import LinearGradient from 'react-native-linear-gradient'



type ChatMessage = {
  id: string,
  message_body: string,
  sender_id: string,
  recipient_id: string,
  time: string,
  message_key_range: string,
}




const Message = ({ message, recipient, contact }: { message: ChatMessage, recipient: string, contact: StoredContact}) => {
  let isClient = recipient == message.recipient_id ? true : false
  let plainText: string = "";
  for (let i = 0; i < message.message_body.length; i++) {
    let currentKey = (isClient ? contact.outgoing_key : contact.incoming_key)[(parseInt(message.message_key_range.split("-")[0]) + i) % 2300]
    plainText += String.fromCharCode(message.message_body.charCodeAt(i) ^ currentKey);
  }
  
  return (
    <View style={{ elevation: 20, shadowColor: Color.primary, marginBottom: 8, maxWidth: "80%", marginLeft: isClient ? 'auto' : 0 }}>
      <StandardBackground style={{ backgroundColor: '#00000030', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomRightRadius: isClient ? 0 : 8, borderBottomLeftRadius: isClient ? 8 : 0 }}>
        <View style={{ paddingVertical: 4, paddingHorizontal: 6 }}>
          <Text selectable={true} style={FontStyles.StandardText}>{plainText}</Text>
          <Text style={[FontStyles.ExtraSmall, { marginLeft: 'auto' }]}>{message.time.split(" ")[1]}</Text>
        </View>
      </StandardBackground>
      <View style={{ borderBottomRightRadius: isClient ? 0 : 8, borderBottomLeftRadius: isClient ? 8 : 0, backgroundColor: '#00000030', height: 8, width: 12, marginLeft: recipient == message.recipient_id ? 'auto' : 0 }}></View>
    </View>
  )
}

const Chat = ({ route, navigation }: any) => {

  const { socket, subscribeToSocket } = useWebSocketStore((state) => state);
  const [messages, setMessages] = useState<ChatMessage[]>([])

  socket.onclose = () => {
    navigation.navigate("connection_lost")
  }  

  


  const { addToOutgoingIndex, getContact } = useContactsStore((state) => state);
  
  const [messageText, setMessageText] = useState<string>("");

  let contact = getContact(route.params.recipient_id);


  if (contact!.outgoing_index >= 2299 && !route.params.no_warn) {
    navigation.navigate("out_of_chats", { recipient_id: route.params.recipient_id })
  }


  const message_reciever = (message: { data: string }) => {
    let parsedMessage = JSON.parse(message.data) as ChatMessage | ChatMessage[];
    if (Array.isArray(parsedMessage)) {
      setMessages(prev => [...prev, ...(parsedMessage as ChatMessage[]).reverse()])
    } else {
      setMessages(prev => [...prev, parsedMessage as ChatMessage])
    }
  };

  const cypher_message = (message: string) => {
    let outputMessage = "";
    let startingIndex = contact!.outgoing_index;
    for (let i = 0; i < message.length; i++) {
      outputMessage += String.fromCharCode(message.charCodeAt(i) ^ contact!.outgoing_key[(contact!.outgoing_index + i) % 2300]);
    }
    addToOutgoingIndex(contact!.id, message.length);
    return {outputMessage, outputIndex: `${startingIndex}-${startingIndex + message.length}`};
  }


  const send_message = () => {
    let cyphered_text = cypher_message(messageText);
    socket.send(JSON.stringify({
      "message_body": cyphered_text.outputMessage,
      "recipient_id": route.params.recipient_id,
      "message_key_range": cyphered_text.outputIndex,
    }))
  }

  

  useEffect(() => {    
    subscribeToSocket(message_reciever);
    socket.send(JSON.stringify({ "new_recipient_id": route.params.recipient_id, "up_to": 10 }))
  }, [])
  
  let scrollViewRef: ScrollView;

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
              <Text style={FontStyles.Header}>{contact?.name}</Text>
              <Text style={FontStyles.StandardText}>{Math.floor((2300 - contact!.outgoing_index) / 50)} Messages Left</Text>
            </View>
          </View>
        </View>
        <KeyboardAvoidingView behavior='padding' style={{ marginTop: 10, maxHeight: "88%" }}>
          <StandardBackground withBorder style={{ borderRadius: 10, height: "100%", width: '100%' }}>
            <ScrollView
              style={{ width: "100%", paddingHorizontal: 16, paddingTop: 8, marginBottom: 120 }}
              ref={ref => {(this! as any).scrollView = ref; scrollViewRef = ref!}}
              onContentSizeChange={() => (this as any).scrollView.scrollToEnd({animated: true})}
            >
              <View>
                {
                  messages && messages.map((item, index) => <Message key={index} recipient={route.params.recipient_id} message={item} contact={contact!} />)
                }
              </View>
            </ScrollView>
            <View style={{ width: "100%", alignItems: 'center' }}>
              <View style={{ elevation: 20, shadowColor: Color.primary, borderRadius: 80, overflow: 'hidden', bottom: 20, position: 'absolute', justifyContent: 'center' }}>
                <StandardBackground>
                  <View style={{ flexDirection: 'row', paddingVertical: 6, paddingLeft: 20, paddingRight: 6, alignItems: 'center' }}>
                    <TextInput style={[FontStyles.StandardText, { width: "80%" }]} value={messageText} onChangeText={text => {scrollViewRef.scrollToEnd({animated: true}); setMessageText(text)}} placeholder='Message' multiline placeholderTextColor={Color.primary} />
                    <TouchableOpacity onPress={() => {send_message(); setMessageText('')}}>
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
            </View>
          </StandardBackground>
        </KeyboardAvoidingView>
      </StandardBackground>
    </SafeAreaView>
  )
}

export default Chat