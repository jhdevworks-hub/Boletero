import React, { useState } from 'react';
import { Text, Image, View, Button, Alert, FlatList, StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Directory, File, Paths } from 'expo-file-system';
import { TICKET_SUBDIR_NAME } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';

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
    <Text style={styles.itemImgPlaceholderText}>Image here</Text>
    <Text style={styles.itemText}>{filename}</Text>
  </View>
);

export default function Gallery() {
  const makeItemsFromFiles = (files: (Directory | File)[]) =>
    files.map((file, i) => ({ id: i, file_stem: file.name }));

  const makeItemsFromTicketsDirectory = () => {
    let ticketDir = new Directory(Paths.document, TICKET_SUBDIR_NAME);
    return makeItemsFromFiles(ticketDir.list());
  }

  const [listData, setListData] = useState(makeItemsFromTicketsDirectory());

  useFocusEffect(
      React.useCallback(() => {
        // Do something when the screen is focused
        setListData(makeItemsFromTicketsDirectory());
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
          renderItem={({ item }) => <Item filename={item.file_stem} />}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
