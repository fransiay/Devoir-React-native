import { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { PanierContext } from '../context/PanierContext';
import { couleurs } from '../utils/couleurs';
import styles from './ComposantsStyles';

const LienMenu = ({ icone, libelle, onPress }) => (
  <Pressable onPress={onPress} style={styles.lienMenu} accessibilityRole="link">
    <Ionicons name={icone} size={20} color={couleurs.principale} />
    <Text style={styles.lienMenuTexte}>{libelle}</Text>
  </Pressable>
);

export default function Menu({ navigation }) {
  const { utilisateur, estAdmin, deconnecter } = useContext(AuthContext);
  const { nombreArticles } = useContext(PanierContext);

  const allerVers = (ecran) => {
    navigation.navigate('Menu Principal', { screen: ecran });
    navigation.closeDrawer();
  };

  return (
    <View style={styles.menu}>
      <LienMenu icone="grid-outline" libelle="Catalogue" onPress={() => allerVers('Catalogue')} />
      <LienMenu
        icone="cart-outline"
        libelle={`Panier (${nombreArticles})`}
        onPress={() => allerVers('Panier')}
      />
      {estAdmin && (
        <LienMenu icone="settings-outline" libelle="Produits" onPress={() => allerVers('Produits')} />
      )}

      <Text style={styles.bonjour}>Bonjour {utilisateur?.nom}</Text>
      <Pressable onPress={deconnecter} style={styles.boutonDeconnexion} accessibilityRole="button">
        <Text style={styles.boutonDeconnexionTexte}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
}
