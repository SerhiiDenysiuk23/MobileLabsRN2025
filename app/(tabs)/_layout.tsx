import {Tabs} from 'expo-router';
import React from 'react';
import {Platform} from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            paddingBottom: 0
          },
          default: {
            paddingBottom: 0
          },

        }),
        tabBarLabelStyle: {
          padding: 0
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({color}) => <IconSymbol size={28} name="house.fill" color={color}/>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Gallery',
          tabBarIcon: ({color}) => <Icon size={26} name="photo" color={color}/>,
        }}
      />


      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({color}) => <Icon size={28} name="person" color={color}/>,
        }}
      />

    </Tabs>
  );
}
