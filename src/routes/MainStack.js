import { Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen from '../screens/Onboarding';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';

const Stack = createNativeStackNavigator();

const MainStack = ({ isOnboardingCompleted }) => {
  return (
    <Stack.Navigator>
      {!isOnboardingCompleted ? (
        <Stack.Screen
          name='Onboarding'
          component={OnboardingScreen}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name='Home'
            component={HomeScreen}
            options={{
              headerTitle: () => (
                <Image
                  style={{ marginTop: -5 }}
                  source={require('../../assets/images/Logo.png')}
                />
              ),
            }}
          />
          <Stack.Screen
            name='Profile'
            component={ProfileScreen}
            options={{
              title: 'Personal information'
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
