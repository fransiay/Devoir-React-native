import { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import { PanierContext } from '../context/PanierContext';
import { formaterPrix } from '../utils/texte';
import styles from './ComposantsStyles';

// Sur téléphone, la colonne droite du web devient une barre au-dessus des onglets
export default function RightColumn({ onVoirPanier }) {
  const { nombreArticles, total } = useContext(PanierContext);

  return (
    <View style={styles.resume}>
      <View>
        <Text style={styles.resumeTexte}>
          {nombreArticles} article{nombreArticles > 1 ? 's' : ''}
        </Text>
        <Text style={styles.resumeTotal}>Total : {formaterPrix(total)}</Text>
      </View>
      <Pressable onPress={onVoirPanier} hitSlop={8} accessibilityRole="link">
        <Text style={styles.resumeLien}>Voir le panier →</Text>
      </Pressable>
    </View>
  );
}
