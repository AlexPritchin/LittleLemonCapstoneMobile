import { useCallback, useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from "./src/screens/Onboarding";
import ProfileScreen from './src/screens/Profile';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Karla-Regular': require('./assets/fonts/Karla-Regular.ttf'),
  });
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isOnboardingCompletedLoaded, setIsOnboardingCompletedLoaded] = useState(false);

  useEffect(() => {
    const getIsOnboardingCompleted = async () => {
      const isUserSignedIn = await AsyncStorage.getItem('userSignedIn');
      setIsOnboardingCompleted(isUserSignedIn);
      setIsOnboardingCompletedLoaded(true);
    };
    getIsOnboardingCompleted();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && isOnboardingCompletedLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isOnboardingCompletedLoaded]);

  if (!fontsLoaded || !isOnboardingCompletedLoaded) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator>
        {!isOnboardingCompleted && (
          <Stack.Screen
            name='Onboarding'
            component={OnboardingScreen}
            options={{
              headerShown: false,
            }}
          />
        )}
        <Stack.Screen
          name='Profile'
          component={ProfileScreen}
          options={{
            title: 'Personal information'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
