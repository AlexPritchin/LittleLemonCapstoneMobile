import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import debounce from 'lodash.debounce';

import CategoriesListItem from '../components/CategoriesListItem';
import MenuListItem from '../components/MenuListItem';

import { createTable, filterByQueryAndCategories, getMenuItems, saveMenuItems } from '../store/database';
import { useUpdateEffect } from '../utils';

const API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['Starters', 'Mains', 'Desserts'];

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
  const [searchBarText, setSearchBarText] = useState('');
  const [query, setQuery] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

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

  useUpdateEffect(() => {
    (async () => {
      let activeCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      activeCategories = activeCategories.map((item) => item.toLowerCase());
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        setMenuData(menuItems);
      } catch (e) {
        Alert.alert(e.message);
        console.log(e);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ height: 324, width: '100%', paddingHorizontal: 25, backgroundColor: '#495E57' }}>
        <Text style={{ fontSize: 64, fontFamily: 'Markazi-Regular', color: '#F4CE14' }}>Little Lemon</Text>
        <View style={{ height: 165, width: '100%', flexDirection: 'row', alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 40, fontFamily: 'Markazi-Regular', color: 'white' }}>Chicago</Text>
            <Text style={{ fontSize: 18, fontFamily: 'Karla-Regular', color: 'white', marginTop: 10 }}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
          </View>
          <Image style={{ width: 140, height: 146, borderRadius: 16 }} source={require('../../assets/images/Hero_image.png')}/>
        </View>
        <View style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', paddingLeft: 7, marginTop: 20, borderWidth: 1, borderRadius: 8, backgroundColor: '#EAEAEA' }}>
          <Ionicons name='search' size={20} style={{ marginTop: -2 }} />
          <TextInput
            value={searchBarText}
            onChangeText={handleSearchChange}
            style={{ flex: 1, marginLeft: 5, fontSize: 16, fontFamily: 'Karla-Regular', }}
          />
        </View>
      </View>
      <View style={{ height: 145, paddingHorizontal: 25, paddingTop: 40, paddingBottom: 30, borderBottomWidth: 1, borderColor: '#EDEDED' }}>
        <Text style={{ fontSize: 20, fontFamily: 'Karla-Regular' }}>ORDER FOR DELIVERY!</Text>
        <FlatList
          horizontal
          data={sections}
          style={{ marginTop: 15 }}
          contentContainerStyle={{ gap: 20 }}
          renderItem={({ item, index }) => (<CategoriesListItem item={item} index={index} onChange={handleFiltersChange} selections={filterSelections}/>)}
        />
      </View>
      <FlatList
        data={menuData}
        style={{ paddingHorizontal: 25 }}
        renderItem={({ item }) => (<MenuListItem item={item} />)}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, width: '100%', backgroundColor: '#EDEFEE' }} />
        )}
      />
    </View>
  );
};

export default HomeScreen;
