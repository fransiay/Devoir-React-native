import 'react-native-gesture-handler';
import { useContext, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ProduitsProvider } from './context/ProduitsContext';
import { PanierProvider } from './context/PanierContext';
import DrawerNavigator from './navigation/DrawerNavigator';
import { LoginScreen } from './screens/LoginScreen';
import { InscriptionScreen } from './screens/InscriptionScreen';
import { couleurs } from './utils/couleurs';
import styles from './AppStyles';

// Remplace ProtectedRoute : seule une personne connectée accède à la boutique
function Contenu() {
  const { estConnecte, chargement } = useContext(AuthContext);
  const [ecran, setEcran] = useState('login');

  if (chargement) {
    return (
      <View style={styles.chargement}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={couleurs.principale} />
        <Text style={styles.texteChargement}>Chargement en cours…</Text>
      </View>
    );
  }

  if (estConnecte) {
    return (
      <NavigationContainer>
        <StatusBar style="light" />
        <DrawerNavigator />
      </NavigationContainer>
    );
  }

  return (
    <View style={styles.racine}>
      <StatusBar style="dark" />
      {ecran === 'login'
        ? <LoginScreen onAllerInscription={() => setEcran('inscription')} />
        : <InscriptionScreen onAllerConnexion={() => setEcran('login')} />}
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.racine}>
      <SafeAreaProvider>
        <AuthProvider>
          <ProduitsProvider>
            <PanierProvider>
              <Contenu />
            </PanierProvider>
          </ProduitsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
