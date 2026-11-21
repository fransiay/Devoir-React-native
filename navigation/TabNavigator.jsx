import { useContext } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { PanierContext } from '../context/PanierContext';
import { CatalogueScreen } from '../screens/CatalogueScreen';
import { PanierScreen } from '../screens/PanierScreen';
import { AdminProduitsScreen } from '../screens/AdminProduitsScreen';
import RightColumn from '../components/RightColumn';
import { couleurs } from '../utils/couleurs';

const Tab = createBottomTabNavigator();

const ICONES = {
  Catalogue: 'grid',
  Panier: 'cart',
  Produits: 'settings',
};

// Le résumé du panier s'affiche au-dessus des onglets, sauf sur l'écran Panier
const BarreOnglets = (props) => {
  const ecran = props.state.routes[props.state.index].name;

  return (
    <View>
      {ecran !== 'Panier' && (
        <RightColumn onVoirPanier={() => props.navigation.navigate('Panier')} />
      )}
      <BottomTabBar {...props} />
    </View>
  );
};

export default function TabNavigator() {
  const { estAdmin } = useContext(AuthContext);
  const { nombreArticles } = useContext(PanierContext);

  return (
    <Tab.Navigator
      // Comme sur le web, l'administrateur arrive sur la gestion des produits
      initialRouteName={estAdmin ? 'Produits' : 'Catalogue'}
      tabBar={(props) => <BarreOnglets {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: couleurs.principale,
        tabBarInactiveTintColor: couleurs.texteDiscret,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONES[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Catalogue" component={CatalogueScreen} />
      <Tab.Screen
        name="Panier"
        component={PanierScreen}
        options={{
          tabBarBadge: nombreArticles > 0 ? nombreArticles : undefined,
          tabBarBadgeStyle: { backgroundColor: couleurs.erreur },
        }}
      />
      {estAdmin && <Tab.Screen name="Produits" component={AdminProduitsScreen} />}
    </Tab.Navigator>
  );
}
