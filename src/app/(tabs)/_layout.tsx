import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Captura',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="photo-camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Galeria',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="collections" color={color} />,
        }}
      />
    </Tabs>
  );
}
