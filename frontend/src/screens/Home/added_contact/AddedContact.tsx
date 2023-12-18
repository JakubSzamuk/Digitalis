import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { StandardBackground } from '../../../constants/colors'
import { UtilityStyles } from '../../../styles/utility'
import { FontStyles } from '../../../styles/text'

const AddedContact = () => {
  return (
    <SafeAreaView>
      <StandardBackground style={UtilityStyles.mainBackground}>
        <View>
          <View>
            <Text style={FontStyles.Header}>Success</Text>
            <Text style={FontStyles.MediumText}>Contact has been added successfully.</Text>

          </View>

        </View>
      </StandardBackground>
    </SafeAreaView>
  )
}

export default AddedContact