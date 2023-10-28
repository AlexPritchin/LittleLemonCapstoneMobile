import { useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

import Onboarding from "./src/screens/Onboarding";

export default function App() {
  const [fontsLoaded] = useFonts({
    'Karla-Regular': require('./assets/fonts/Karla-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Onboarding onLayoutRootView={onLayoutRootView}/>
  );
}
