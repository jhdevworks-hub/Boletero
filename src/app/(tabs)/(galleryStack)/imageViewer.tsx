import { useLocalSearchParams } from "expo-router";
import { Image, View } from "react-native";

export default function ImageViewerScreen() {
  const { image } = useLocalSearchParams();
  const image_uri = Array.isArray(image) ? (image[0] ?? '') : (image ?? '');
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={{ uri: image_uri }} style={{ width: "100%", height: "100%" }} />
    </View>
  );
}