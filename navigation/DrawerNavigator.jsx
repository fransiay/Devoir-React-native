import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './TabNavigator';
import Banner from '../components/Banner';
import Sidebar from '../components/Sidebar';
import { couleurs } from '../utils/couleurs';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Menu Principal"
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        header: ({ navigation }) => <Banner navigation={navigation} />,
        drawerStyle: { backgroundColor: couleurs.fondColonne },
      }}
    >
      {/* L'entrée "Menu Principal" affiche TabNavigator, le menu Bottom Tabs */}
      <Drawer.Screen
        name="Menu Principal"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
