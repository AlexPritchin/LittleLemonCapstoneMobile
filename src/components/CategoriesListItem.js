import {
  Text,
  TouchableOpacity
} from 'react-native';

const CategoriesListItem = ({ item, index, onChange, selections }) => {
  return (
    <TouchableOpacity
      style={{ height: 30, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, backgroundColor: !selections[index] ? '#EDEFEE' : '#495E57', borderRadius: 8 }}
      onPress={() => onChange(index)}>
      <Text style={{ fontSize: 16, fontFamily: 'Karla-Regular', color: !selections[index] ? '#495E57' : 'white' }}>{item}</Text>
    </TouchableOpacity>
  );
};

export default CategoriesListItem;
