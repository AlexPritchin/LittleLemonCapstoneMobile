import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import ListItem from '../components/ListItem';

import { createTable, getMenuItems, saveMenuItems } from '../store/database';

const API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

const HomeScreen = ({ navigation, route }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [userFirstName, setUserFirstName] = useState(
    route.params?.userName ?? ''
  );
  const [userLastName, setUserLastName] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const getUserAvatarData = async () => {
      const storeData = await AsyncStorage.multiGet([
        'avatarSrc',
        'firstName',
        'lastName',
      ]);
      setImageSrc(storeData.find((item) => item[0] === 'avatarSrc')[1] ?? '');
      setUserFirstName(
        storeData.find((item) => item[0] === 'firstName')[1] ??
          route.params?.userName ??
          ''
      );
      setUserLastName(storeData.find((item) => item[0] === 'lastName')[1] ?? '');
    };
    getUserAvatarData();
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            overflow: 'hidden',
          }}
          onPress={() => navigation.navigate('Profile', route.params)}>
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
        </TouchableOpacity>
      ),
    });
  }, [navigation, imageSrc, userFirstName, userLastName]);

  const [menuData, setMenuData] = useState([]);

  const fetchData = async() => {
    try {
      const response = await fetch(API_URL);
      const parsedResponse = await response.json();
      return parsedResponse.menu;
    } catch (err) {
      Alert.alert('Network error', 'An error occured while fetching the menu from server');
      console.log(err);
    }
    return [];
  };

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();

        if (!menuItems.length) {
          menuItems = await fetchData();
          saveMenuItems(menuItems);
        }

        setMenuData(menuItems);
      } catch (e) {
        Alert.alert(e.message);
      }
    };
    loadMenuItems();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={menuData}
        style={{ padding: 25 }}
        renderItem={({ item }) => (<ListItem item={item} />)}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, width: '100%', backgroundColor: '#EDEFEE' }} />
        )}
        keyExtractor={(item, index) => index}
      />
    </View>
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

export default HomeScreen;
