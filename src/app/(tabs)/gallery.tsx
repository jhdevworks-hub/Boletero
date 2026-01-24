import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Directory, File, Paths } from 'expo-file-system';
import React, { useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TICKET_SUBDIR_NAME } from '../../constants';

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

export default function Gallery() {

  type ItemProps = { file_uri: string; filename: string };

  const showDeleteDialog = (file_uri: string, filename: string) => {
    Alert.alert("Delete Confirmation", `Are you sure you want to delete ${filename}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const file = new File(file_uri);
            file.delete();
            file.exists ? Alert.alert("Error", `Could not delete ${filename}.`) :
              Alert.alert("Deleted", `${filename} has been deleted.`);
            refreshListData();
          }
        }
      ]
    );
  };

  const Item = ({ file_uri, filename }: ItemProps) => (
    <View style={styles.itemView} >
      <Image
        style={{ width: 50, height: 50, backgroundColor: '#a0a0a0' }}
        // Placeholder image; replace with actual image source as needed
        source={{ uri: file_uri }}
      />
      <Text style={styles.itemText}>{filename}</Text>
      <Pressable
        onPress={() => showDeleteDialog(file_uri, filename)}>
        <MaterialIcons size={28} name="delete" color={'#004bf9'} />
      </Pressable>
    </View>
  );

  const makeItemsFromFiles = (files: (Directory | File)[]) =>
    files.map((file, i) => ({ id: i, uri: file.uri, file_stem: file.name }));

  const makeItemsFromTicketsDirectory = () => {
    let ticketDir = new Directory(Paths.document, TICKET_SUBDIR_NAME);
    return makeItemsFromFiles(ticketDir.list());
  }

  const [listData, setListData] = useState(makeItemsFromTicketsDirectory());

  function refreshListData() {
    setListData(makeItemsFromTicketsDirectory());
  }

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      refreshListData();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <FlatList
          data={listData}
          renderItem={({ item }) => <Item file_uri={item.uri} filename={item.file_stem} />}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
