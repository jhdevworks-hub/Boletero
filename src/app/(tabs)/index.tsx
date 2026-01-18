import { Text, View, StyleSheet, Pressable, Button, Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { File, Paths, Directory } from 'expo-file-system';
import { TICKET_SUBDIR_NAME, EXAMPLE_PREFIX } from '../../constants';

import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

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
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [photoUri, setUri] = useState<string | null>(null);
  const cameraType: CameraType = 'back';
  const cameraMode: CameraMode = 'picture';

  if (!permission) {
    // Camera permissions are still loading.
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.message_container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) setUri(photo.uri);
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <Text style={{ flex: 1 }}>Last img path: {photoUri}</Text>
        <CameraView
          style={styles.camera}
          ref={ref}
          mode={'picture'}
          facing={'back'}
        />
        <View style={styles.shutterContainer}>
          <Pressable onPress={takePicture}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: "white",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.main_container}>
      {renderCamera()}

    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  message_container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: { flex: 1 },
  camera: { flex: 10 },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});
