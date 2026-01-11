import { Text, Image, View, FlatList, StyleSheet } from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const DATA = [
  {
    file_stem: 'boleta1',
    img: 'asdf',
  },
  {
    file_stem: 'boleta2',
    img: 'qwer',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

type ItemProps = {filename: string, img_label: string};
const Item = ({filename,img_label}: ItemProps) => (
  <View style={styles.item}>
    
    {/* <Image style={styles.title} source={require('@expo/snack-static/react-native-logo.png')}></Image> */}
    <Text style={styles.title}>{img_label}</Text>
    <Text style={styles.title}>{filename}</Text>
  </View>
);

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({item}) => <Item filename={item.file_stem} img_label={item.img} />}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

export default function Gallery() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Gallery.</Text>
      <Text>Edit app/gallery.tsx to edit this screen.</Text>
      <App></App>
    </View>
  );
}
