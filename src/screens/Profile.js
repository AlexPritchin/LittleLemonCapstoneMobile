import { useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { validateEmail } from '../utils';

const ProfileScreen = ({ navigation, route }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [userFirstName, setUserFirstName] = useState(
    route.params?.userName ?? ''
  );
  const [userLastName, setUserLastName] = useState('');
  const [userEmail, setUserEmail] = useState(route.params?.userEmail ?? '');
  const [userPhone, setUserPhone] = useState('');
  const [userFirstNameValid, setUserFirstNameValid] = useState(true);
  const [userLastNameValid, setUserLastNameValid] = useState(true);
  const [userEmailValid, setUserEmailValid] = useState(true);
  const [userPhoneValid, setUserPhoneValid] = useState(true);

  const phoneInputRef = useRef();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            overflow: 'hidden',
          }}>
          {imageSrc ? (
            <Image
              style={{ flex: 1, resizeMode: 'cover' }}
              source={{ uri: imageSrc }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#62D6C4',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'Karla-Regular',
                }}>
                {userFirstName.slice(0, 1)}
                {userLastName.slice(0, 1)}
              </Text>
            </View>
          )}
        </View>
      ),
    });
  }, [navigation, imageSrc, userFirstName, userLastName]);

  const userFirstNameChange = (text) => {
    setUserFirstName(text);
    setUserFirstNameValid(!!text);
  };

  const userLastNameChange = (text) => {
    setUserLastName(text);
    setUserLastNameValid(!!text);
  };

  const userEmailChange = (text) => {
    setUserEmail(text);
    setUserEmailValid(validateEmail(text));
  };

  const userPhoneChange = (text) => {
    setUserPhone(text);
    setUserPhoneValid(!!text);
  };

  const buttonDisabled =
    !userFirstName ||
    !userLastName ||
    !userEmail ||
    !userPhone ||
    !userFirstNameValid ||
    !userLastNameValid ||
    !userEmailValid ||
    !userPhoneValid;

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageSrc(result.assets[0].uri);
    }
  };

  const saveAll = async () => {
    await AsyncStorage.multiSet([
      ['avatarSrc', imageSrc],
      ['firstName', userFirstName],
      ['lastName', userLastName],
      ['email', userEmail],
      ['phone', userPhone],
    ]);
  };

  const resetAll = async () => {
    const storeData = await AsyncStorage.multiGet([
      'avatarSrc',
      'firstName',
      'lastName',
      'email',
      'phone',
    ]);
    setImageSrc(storeData.find((item) => item[0] === 'avatarSrc')[1] ?? '');
    setUserFirstName(
      storeData.find((item) => item[0] === 'firstName')[1] ??
        route.params?.userName ??
        ''
    );
    setUserLastName(storeData.find((item) => item[0] === 'lastName')[1] ?? '');
    setUserEmail(
      storeData.find((item) => item[0] === 'email')[1] ??
        route.params?.userEmail ??
        ''
    );
    const defaultPhone = storeData.find((item) => item[0] === 'phone')[1];
    setUserPhone(defaultPhone);
    if (defaultPhone) {
      phoneInputRef.current.setNativeProps({ text: defaultPhone });
    } else {
      phoneInputRef.current.clear();
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, padding: 2, backgroundColor: 'white' }}
      bounces={false}>
      <View
        style={{
          flex: 1,
          padding: 20,
          borderWidth: 1,
          borderColor: '#D0D0D6',
          borderRadius: 8,
        }}>
        <Text
          style={{
            fontFamily: 'Karla-Regular',
            fontSize: 12,
            color: '#485D6B',
          }}>
          Avatar
        </Text>
        <View
          style={{
            width: '100%',
            height: 50,
            marginTop: 15,
            flexDirection: 'row',
            gap: 30,
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              overflow: 'hidden',
            }}>
            {imageSrc ? (
              <Image
                style={{ flex: 1, resizeMode: 'cover' }}
                source={{ uri: imageSrc }}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#62D6C4',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 24,
                    fontFamily: 'Karla-Regular',
                  }}>
                  {userFirstName.slice(0, 1)}
                  {userLastName.slice(0, 1)}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={{
              height: '70%',
              paddingHorizontal: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#495E57',
              borderRadius: 8,
            }}
            onPress={() => {
              pickAvatar();
            }}>
            <Text style={{ color: 'white', fontFamily: 'Karla-Regular' }}>
              Change
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: '70%',
              paddingHorizontal: 15,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#495E57',
            }}
            onPress={() => {
              setImageSrc('');
            }}>
            <Text style={{ color: '#9899AC', fontFamily: 'Karla-Regular' }}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formFieldsContainer}>
          <View>
            <Text style={styles.formLabel}>
              First Name<Text style={{ color: '#FF5050' }}>*</Text>
            </Text>
            <TextInput
              value={userFirstName}
              onChangeText={(text) => {
                userFirstNameChange(text);
              }}
              style={[
                styles.formTextInput,
                !userFirstNameValid && { borderColor: '#FD5D5D' },
              ]}
            />
            {!userFirstNameValid && (
              <Text style={styles.formErrorText}>This field is required</Text>
            )}
          </View>
          <View>
            <Text style={styles.formLabel}>
              Last Name<Text style={{ color: '#FF5050' }}>*</Text>
            </Text>
            <TextInput
              value={userLastName}
              onChangeText={(text) => {
                userLastNameChange(text);
              }}
              style={[
                styles.formTextInput,
                !userLastNameValid && { borderColor: '#FD5D5D' },
              ]}
            />
            {!userLastNameValid && (
              <Text style={styles.formErrorText}>This field is required</Text>
            )}
          </View>

          <View>
            <Text style={styles.formLabel}>
              Email<Text style={{ color: '#FF5050' }}>*</Text>
            </Text>
            <TextInput
              value={userEmail}
              onChangeText={(text) => {
                userEmailChange(text);
              }}
              keyboardType="email-address"
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
          <View>
            <Text style={styles.formLabel}>
              Phone number<Text style={{ color: '#FF5050' }}>*</Text>
            </Text>
            <MaskedTextInput
              ref={phoneInputRef}
              mask="(999) 999-9999"
              keyboardType="phone-pad"
              onChangeText={(text) => {
                userPhoneChange(text);
              }}
              style={[
                styles.formTextInput,
                !userPhoneValid && { borderColor: '#FD5D5D' },
              ]}
            />
            {!userPhoneValid && (
              <Text style={styles.formErrorText}>This field is required</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={{
            height: 40,
            width: '100%',
            marginTop: 60,
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F4CE14',
            borderColor: '#E1B247',
            borderWidth: 1,
            borderRadius: 8,
          }}
          onPress={() => {
            AsyncStorage.clear();
            navigation.goBack();
          }}>
          <Text>Log out</Text>
        </TouchableOpacity>
        <View
          style={{
            height: 40,
            width: '100%',
            flexDirection: 'row',
            marginTop: 40,
            marginBottom: 60,
            paddingHorizontal: 20,
            gap: 30,
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#495E57',
              borderRadius: 8,
            }}
            onPress={() => {
              resetAll();
            }}>
            <Text style={{ color: '#9899AC' }}>Discard changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#495E57',
                borderRadius: 8,
              },
              buttonDisabled && { backgroundColor: '#CBD2D9' },
            ]}
            onPress={() => {
              if (!buttonDisabled) {
                saveAll();
              }
            }}>
            <Text
              style={[
                { color: 'white' },
                buttonDisabled && { color: 'black' },
              ]}>
              Save changes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  formLabel: {
    fontSize: 20,
    fontFamily: 'Karla-Regular',
    color: '#485D6B',
  },
  formFieldsContainer: {
    width: '100%',
    gap: 20,
    marginTop: 20,
  },
  formTextInput: {
    height: 40,
    width: '100%',
    marginTop: 5,
    paddingLeft: 10,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#E8E8EE',
    fontSize: 16,
    fontFamily: 'Karla-Regular',
  },
  formErrorText: {
    fontSize: 14,
    fontFamily: 'Karla-Regular',
    color: '#FF5050',
  },
});

export default ProfileScreen;
