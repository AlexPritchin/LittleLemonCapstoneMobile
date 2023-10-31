import { useCallback, useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserSignedInContext } from './src/store/context';
import MainStack from './src/routes/MainStack';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Karla-Regular': require('./assets/fonts/Karla-Regular.ttf'),
    'Markazi-Regular': require('./assets/fonts/MarkaziText-Regular.ttf'),
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
    <UserSignedInContext.Provider value={{ setIsOnboardingCompleted }}>
      <NavigationContainer onReady={onLayoutRootView}>
        <MainStack isOnboardingCompleted={isOnboardingCompleted} />
      </NavigationContainer>
    </UserSignedInContext.Provider>
  );
}
