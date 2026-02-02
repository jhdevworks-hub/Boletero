import { Directory, File, Paths } from 'expo-file-system';
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { TICKET_SUBDIR_NAME } from '../../constants';

import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";


const copyToStorage = (uriInCache: string) => {
  // Check if ticket directories exist
  const ticketsPermDirectory = new Directory(Paths.document, TICKET_SUBDIR_NAME);
  if (!(ticketsPermDirectory.exists)) {
    ticketsPermDirectory.create();
  }

  // Get a unique filename in permanent storage
  let filename = findNextFilename(ticketsPermDirectory, "boleta_", ".jpg");
  if (!filename) {
    throw new Error("Could not find a unique filename");
  }

  // Move file from cache to permanent storage 
  const cacheFile = new File(uriInCache);
  if (!cacheFile.exists) {
    throw new Error("File to move does not exist: " + uriInCache);
  }
  const docFile = new File(ticketsPermDirectory, filename);
  cacheFile.move(docFile);

  return docFile.uri;
};

const findNextFilename = (directory: Directory, prefix: string, extension: string): string | null => {
  let fileIndex = 0;
  const maxPowerOfTen = 2;
  const maxIndex = 10 ** maxPowerOfTen;
  for (let fileIndex = 0; fileIndex < maxIndex; fileIndex++) {
    let fileSuffix = String(fileIndex).padStart(maxPowerOfTen, "0");
    let candidateFilename = `${prefix}${fileSuffix}${extension}`;
    const candidateUri = `${directory.uri}/${candidateFilename}`;
    const candidateFile = new File(candidateUri);
    const info = candidateFile.info();
    if (!info.exists) {
      return candidateFilename;
    };
  }

  return null;
};

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
    const photo = await ref.current?.takePictureAsync({shutterSound: false});
    if (photo?.uri) {
      setUri(photo.uri);
      copyToStorage(photo.uri);
    }
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
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
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
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
