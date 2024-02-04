import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Color, StandardBackground } from '../../../constants/colors'
import { UtilityStyles } from '../../../styles/utility'
import { FontStyles } from '../../../styles/text'
import Logo from '@/components/Logo'
import useContactsStore from '../../../stores/Contacts'
import { useRouter } from 'expo-router'

const AddedContact = () => {
  const { tempContact, addContact, resetTempContact } = useContactsStore((state) => state);
  const [contactName, setContactName] = useState<string>("")
  
  const router = useRouter();


  const handle_save_form = () => {
    addContact({ ...tempContact, name: contactName});
    resetTempContact();

    router.navigate("Home");
  }

  const handleAddContact = () => {
    addContact({
      name: "Testing account NEW",
      id: "11",
      outgoing_key: tempContact.outgoing_key,
      incoming_key: tempContact.incoming_key,
      outgoing_index: 0,
    });
    resetTempContact();

    router.navigate("Home");
  }

  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <View style={{ width: "100%", alignItems: 'center', marginTop: 102, flex: 1 }}>
          <View>
            <Text style={FontStyles.Header}>Success</Text>
            <Text style={FontStyles.MediumText}>Contact has been added successfully.</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={FontStyles.MediumText}>Name:</Text>
              <TextInput placeholder='Their name' onChangeText={(text) => setContactName(text)} placeholderTextColor={"#5F5F5F"} style={[FontStyles.MediumText, { marginLeft: 10, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: Color.secondary, borderRadius: 10, minWidth: 160 }]} />
            </View>
          </View>
          <TouchableOpacity style={{ marginTop: 40 }} onPress={handle_save_form}>
            <StandardBackground withBorder style={{ borderRadius: 3 }}>
              <View style={{ width: 212, height: 52, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={FontStyles.StandardText}>Save</Text>
              </View>
            </StandardBackground>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleAddContact}>
          <Text>Add test contact</Text>
        </TouchableOpacity>
        <View style={{ width: "100%", alignItems: 'center', marginBottom: 20 }}>
          <Logo />
        </View>
      </StandardBackground>
    </SafeAreaView>
  )
}

export default AddedContact