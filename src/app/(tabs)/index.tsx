import { Text, View, Button, Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { File, Paths } from 'expo-file-system';



async function generateFile() {
  try {
    // Option B: create in cache then move to documents
    const cacheFile = new File(Paths.cache, "example.txt");
    await cacheFile.create();
    await cacheFile.write("Hello, world!");
    const docFile = new File(Paths.document, "example.txt");
    await cacheFile.move(docFile);

    const msg = `Saved to ${docFile.uri}`;
    if (Platform.OS === "web") window.alert(msg);
    else Alert.alert("Saved", msg);
  } catch (error) {
    if (Platform.OS === "web") window.alert(String(error));
    else Alert.alert("Error", String(error));
    console.error(error);
  }

}

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Index screen. Would be camera mode.</Text>
      <Button title="Take picture (creates text file)"
        color="#e30808"
        onPress={() => generateFile()}>
      </Button>
    </View>
  );
}
