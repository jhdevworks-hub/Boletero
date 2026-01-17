import { Text, View, StyleSheet, Button, Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { File, Paths, Directory } from 'expo-file-system';
import { TICKET_SUBDIR_NAME, EXAMPLE_PREFIX } from '../../constants';
import { CameraView, CameraMode, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef } from "react";

async function generateFile() {
  try {
    let exampleIndex = 0;
    let formattedNumber = String(exampleIndex).padStart(2, "0");
    let candidateFilename = `${EXAMPLE_PREFIX}${formattedNumber}.txt`;

    // Check if ticket directories exist
    const ticketsPermDirectory = new Directory(Paths.document, TICKET_SUBDIR_NAME);
    if (!(ticketsPermDirectory.exists)) {
      ticketsPermDirectory.create();
    }
    const ticketsCacheDirectory = new Directory(Paths.cache, TICKET_SUBDIR_NAME);
    if (!(ticketsCacheDirectory.exists)) {
      ticketsCacheDirectory.create();
    }

    // Create a new filename that does not exist yet
    do {
      const candidateUri = `${ticketsPermDirectory.uri}/${candidateFilename}`;
      const candidateFile = new File(candidateUri);
      const info = candidateFile.info();
      if (!info.exists) break;
      formattedNumber = String(exampleIndex).padStart(2, "0");
      candidateFilename = `${EXAMPLE_PREFIX}${formattedNumber}.txt`;
      exampleIndex++;
    } while (true)

    // Create the file in cache, write to it, then move to tickets folder
    const cacheFile = new File(ticketsCacheDirectory, candidateFilename);
    await cacheFile.create();
    await cacheFile.write("Hello, world!");
    const docFile = new File(ticketsPermDirectory, candidateFilename);
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
  const cameraType: CameraType = 'back';
  const cameraMode: CameraMode = 'picture';
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return null;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CameraView
        style={styles.camera}
        mode={cameraMode}
        facing={cameraType}
        />
      <Text style={{ flex: 1 }}>Index screen. Would be camera mode.</Text>
      <Button title="Take picture (creates text file)"
        color="#e30808"
        onPress={() => generateFile()}>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: StyleSheet.absoluteFillObject
});