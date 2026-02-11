import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Directory, File, Paths } from 'expo-file-system';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, Image, Pressable, SectionList, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TICKET_SUBDIR_NAME } from '../../../constants';

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
  sectionText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export default function Gallery() {

  // Photo viewer ------------------------------------
  const router = useRouter();

  const goToImageViewer = (image_uri: string) => {
    router.push({ pathname: "/imageViewer", params: { image: image_uri } });
  };

  // Delete dialog ------------------------------------
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

  // List types and functions ------------------------------------
  type ItemProps = { file_uri: string; filename: string };
  type ItemObject = { id: number; uri: string; file_stem: string };
  type SectionObject = { title: string, data: ItemObject[] };

  const Item = ({ file_uri, filename }: ItemProps) => (
    <View style={styles.itemView} >
      <Pressable style={{ flex: 8, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => goToImageViewer(file_uri)}>
        <Image
          style={{ width: 50, height: 50, backgroundColor: '#a0a0a0' }}
          // Placeholder image; replace with actual image source as needed
          source={{ uri: file_uri }}
        />
        <Text style={styles.itemText}>{filename}</Text>
      </Pressable>
      <Pressable style={{ flex: 1, alignItems: 'center' }}
        onPress={() => showDeleteDialog(file_uri, filename)}>
        <MaterialIcons size={28} name="delete" color={'#004bf9'} />
      </Pressable>
    </View>
  );

  const makeItemsFromFiles = (files: (Directory | File)[]): ItemObject[] =>
    files.map((file, i) => ({ id: i, uri: file.uri, file_stem: file.name }));

  const makeItemsFromAppDirectory = (): ItemObject[] => {
    let ticketDir = new Directory(Paths.document, TICKET_SUBDIR_NAME);
    return makeItemsFromFiles(ticketDir.list());
  }

  const [sectionsData, setSectionsData] = useState<SectionObject[]>([]);

  function refreshListData() {
    setSectionsData([
      { title: "Internal Tickets", data: makeItemsFromAppDirectory() },
      { title: "External Tickets", data: [] }
    ]);
  }

  // List refresh on screen focus ------------------------------------
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
        <SectionList
          sections={sectionsData}
          renderItem={({ item }) => <Item file_uri={item.uri} filename={item.file_stem} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionText}>{title}</Text>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
