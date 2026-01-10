import { useColorScheme } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'

const Dashboard = () => {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light

  return (
    <Tabs
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
      backgroundColor: theme.background,
      height: 55, 
},
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.icon,
      tabBarLabelStyle: {
        fontWeight: 'bold',
        fontSize: 12,  
      },
    }}
  >
    <Tabs.Screen
      name="Home"
      options={{
        title: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Quran"
      options={{
        title: 'Quran',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="book-outline" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Sunnah"
      options={{
        title: 'Sunnah',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="reader-outline" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="Adhkar"
      options={{
        title: 'Adhkar',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="moon-outline" size={size} color={color} />
        ),
      }}
    />
  </Tabs>

  )
}

export default Dashboard
