import React, { useState } from 'react';
import { Text, Image, View, Button, Alert, FlatList, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Directory, Paths } from 'expo-file-system';
import { TICKET_SUBDIR_NAME, EXAMPLE_PREFIX } from '../../constants';



function queryFiles() {
  const ticketsDirectory = new Directory(Paths.document, TICKET_SUBDIR_NAME);
  const filesList = ticketsDirectory.list();
  Alert.alert("N of files: " + filesList.length);
  let msg = 'Files:\n';
  for (const file of filesList) {
    msg += `${file.name}\n`;
  }
  Alert.alert(msg);
  return msg
}


function getListOfFilesInStorage() {
  const ticketsDirectory = new Directory(Paths.document, TICKET_SUBDIR_NAME);
  const filesList = ticketsDirectory.list();
  return filesList;
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#dbdbdb',
  },
  itemView: {
    flexDirection: 'row',
    backgroundColor: '#5a5a5a',
    padding: 3,
    marginVertical: 2,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  itemImgPlaceholderText: {
    flex: 1,
    fontSize: 8,
    height: 50,
  },
  itemText: {
    flex: 6,
    fontSize: 16,
  },
});

type ItemProps = { filename: string };

const Item = ({ filename }: ItemProps) => (
  <View style={styles.itemView} >
    {/* <Image style={styles.itemText} source={require('@expo/snack-static/react-native-logo.png')}></Image> */}
    <Text style={styles.itemImgPlaceholderText}>Image here</Text>
    <Text style={styles.itemText}>{filename}</Text>
  </View>
);

export default function Gallery() {
  const [miniConsoleText, setMiniConsoleText] = useState('Hello from mini console!');
  const [listData, setListData] = useState([
    { id: 1, file_stem: "ItemPlaceholder1" },
    { id: 2, file_stem: "ItemPlaceholder2" }]);

  function updateViews() {
    updateMiniConsole();
    updateList();
  }

  function updateMiniConsole() {
    const txt = queryFiles();
    setMiniConsoleText(txt);
  }

  function updateList() {
    const filesList = getListOfFilesInStorage();
    let itemsList: Array<{ id: number, file_stem: string }> = [];
    filesList.forEach((file, i) => {
      itemsList.push({ id: i, file_stem: file.name });
    });
    setListData(itemsList);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <FlatList
          data={listData}
          renderItem={({ item }) => <Item filename={item.file_stem} />}
        />
        <Text>MiniConsoleText{`\n`}.{miniConsoleText}</Text>
        <Button title="Query files in storage"
          color="#e30808"
          onPress={() => updateViews()}>
        </Button>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
