import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { validateEmail } from '../utils';

const OnboardingScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userNameValid, setUserNameValid] = useState(true);
  const [userEmailValid, setUserEmailValid] = useState(true);

  const userNameChange = text => {
    setUserName(text);
    setUserNameValid(!!text);
  };

  const userEmailChange = text => {
    setUserEmail(text);
    setUserEmailValid(validateEmail(text));
  };

  const buttonDisabled =
    !userName || !userEmail || !userNameValid || !userEmailValid;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../../assets/images/Logo.png')}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>Let us get to know you</Text>
        <View style={styles.formFieldsContainer}>
          <Text style={styles.formLabel}>
            First Name<Text style={{ color: '#FF5050' }}>*</Text>
          </Text>
          <TextInput
            value={userName}
            onChangeText={text => {
              userNameChange(text);
            }}
            style={[
              styles.formTextInput,
              !userNameValid && { borderColor: '#FD5D5D' },
            ]}
          />
          {!userNameValid && (
            <Text style={styles.formErrorText}>This field is required</Text>
          )}
          <Text style={styles.formLabel}>
            Email<Text style={{ color: '#FF5050' }}>*</Text>
          </Text>
          <TextInput
            value={userEmail}
            onChangeText={text => {
              userEmailChange(text);
            }}
            keyboardType='email-address'
            style={[
              styles.formTextInput,
              !userEmailValid && { borderColor: '#FD5D5D' },
            ]}
          />
          {!userEmailValid && (
            <Text style={styles.formErrorText}>
              This field is required and should be a valid e-mail
            </Text>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.buttonTouchable,
            buttonDisabled && { backgroundColor: '#CBD2D9' },
          ]}
          onPress={() => {
            if (!buttonDisabled) {
              AsyncStorage.setItem('userSignedIn', JSON.stringify(true));
              navigation.navigate('Profile', {
                userName,
                userEmail,
              });
            }
          }}
        >
          <Text
            style={[styles.buttonText, buttonDisabled && { color: '#485D6B' }]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DEE3E9',
  },
  imageContainer: {
    height: 120,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    height: '80%',
    width: '70%',
    resizeMode: 'contain',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 50,
    backgroundColor: '#CBD2D9',
  },
  formLabel: {
    fontSize: 26,
    fontFamily: 'Karla-Regular',
    color: '#485D6B',
  },
  formFieldsContainer: {
    width: '100%',
    gap: 20,
    alignItems: 'center',
  },
  formTextInput: {
    height: 40,
    width: '100%',
    paddingLeft: 10,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#485D6B',
    fontSize: 20,
    fontFamily: 'Karla-Regular',
  },
  formErrorText: {
    fontSize: 18,
    fontFamily: 'Karla-Regular',
    color: '#FF5050',
  },
  buttonContainer: {
    height: 180,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 60,
    paddingRight: 30,
  },
  buttonTouchable: {
    height: 40,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#485D6B',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 26,
    fontFamily: 'Karla-Regular',
    color: 'white',
  },
});

export default OnboardingScreen;
