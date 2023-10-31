import {
  Image,
  Text,
  View,
} from 'react-native';

const ListItem = ({ item }) => {

  return (
    <View style={{ height: 135, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontFamily: 'Karla-Regular' }}>{item.name}</Text>
        <Text style={{ fontSize: 16, fontFamily: 'Karla-Regular', color: '#495E57', marginTop: 20 }} numberOfLines={2}>{item.description}</Text>
        <Text style={{ fontSize: 16, fontFamily: 'Karla-Regular', color: '#495E57', marginTop: 10 }}>${item.price}</Text>
      </View>
      <Image
        style={{ height: 80, width: 80 }}
        source={{
          uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`
        }}/>
    </View>
  );
};

export default ListItem;
