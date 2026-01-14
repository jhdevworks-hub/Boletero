import React, { useState } from 'react';
import { Text, Image, View, Button, Alert, FlatList, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Directory, Paths } from 'expo-file-system';

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

async function queryFiles() {
  const documentsDirectory = Paths.document;

  const files = documentsDirectory.list();
  Alert.alert("N of files: ${files.length}");
  let msg = 'Files:\n';
  for await (const file of files) {
    msg += `${file.name}\n`;
  }
  Alert.alert(msg);
  return msg
}

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

type ItemProps = { filename: string, img_label: string };
const Item = ({ filename, img_label }: ItemProps) => (
  <View style={styles.item}>

    {/* <Image style={styles.title} source={require('@expo/snack-static/react-native-logo.png')}></Image> */}
    <Text style={styles.title}>{img_label}</Text>
    <Text style={styles.title}>{filename}</Text>
  </View>
);

const FlatListViewer = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item filename={item.file_stem} img_label={item.img} />}
      />
    </SafeAreaView>
  </SafeAreaProvider>
);

export default function Gallery() {
  const [miniConsoleText, setMiniConsoleText] = useState('Hello from mini console!');

  async function updateMiniConsole() {
    const txt = await queryFiles();
    setMiniConsoleText(txt);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Gallery.</Text>
      <FlatListViewer></FlatListViewer>
      <Text>MiniConsoleText{`\n`}.{miniConsoleText}</Text>
      <Button title="Query files in storage"
        color="#e30808"
        onPress={() => updateMiniConsole()}>
      </Button>
    </View>
  );
}
