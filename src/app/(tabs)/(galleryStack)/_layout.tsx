import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="gallery"
        options={{
          title: 'Gallery List',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="imageViewer"
        options={{
          title: 'Viewer',
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
