import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Colors from '.././constants/Colors'

const ThemedView = ({style, ...props}) => {
    const colorScheme = useColorScheme()
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light

    return (
        <View 
        style={[{backgroundColor: theme.background}, style]}
        {...props}
        
        />

    )
}

export default ThemedView

const styles = StyleSheet.create({})