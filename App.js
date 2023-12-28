
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Home from './screens/Home';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingProvider, useOnboarding } from './OnboardingContext';
import { setupDatabaseAsync } from './Database';


const Stack = createNativeStackNavigator();

const App = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
    try{
    const checkOnboardingStatus = async () => {
      const userData = await AsyncStorage.getItem('userData');
      setIsOnboarded(!!userData);
    };
      await setupDatabaseAsync();
      checkOnboardingStatus();
    }
    catch(error){
      console.error('Error during initialization:', error);
    }
  }
    initializeApp();
    //
  }, []);

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
  };

  return (
     <OnboardingProvider>
    <NavigationContainer>
      <Stack.Navigator>
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
       
     </OnboardingProvider>
  );
};

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
