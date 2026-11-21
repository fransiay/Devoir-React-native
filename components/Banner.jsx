import { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PanierContext } from '../context/PanierContext';
import { couleurs } from '../utils/couleurs';
import styles from './ComposantsStyles';

export default function Banner({ navigation }) {
  const { nombreArticles } = useContext(PanierContext);
  const insets = useSafeAreaInsets();

  const allerVers = (ecran) => navigation.navigate('Menu Principal', { screen: ecran });

  return (
    <View style={[styles.banner, { paddingTop: insets.top + 12 }]}>
      <View style={styles.bannerGauche}>
        <Pressable
          onPress={() => navigation.openDrawer()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Ouvrir le menu"
        >
          <Ionicons name="menu" size={28} color={couleurs.blanc} />
        </Pressable>
        <Pressable onPress={() => allerVers('Catalogue')} accessibilityRole="link">
          <Text style={styles.bannerTitre}>Waza Shop</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => allerVers('Panier')}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Panier, ${nombreArticles} article(s)`}
      >
        <Ionicons name="cart-outline" size={26} color={couleurs.blanc} />
        {nombreArticles > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeTexte}>{nombreArticles}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
