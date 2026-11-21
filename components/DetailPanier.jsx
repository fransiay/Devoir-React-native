import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { formaterPrix } from '../utils/texte';
import styles from './ComposantsStyles';

function DetailPanier({ ligne, max, onChangerQuantite, onRetirer }) {
  const minimum = ligne.quantite <= 1;
  const maximum = ligne.quantite >= max;

  return (
    <View style={styles.ligne}>
      <View style={styles.ligneHaut}>
        <Text style={styles.ligneNom}>{ligne.nom}</Text>
        <Text style={styles.lignePrix}>– {formaterPrix(ligne.prix)}</Text>
      </View>

      <View style={styles.ligneBas}>
        <Pressable
          onPress={() => onChangerQuantite(ligne.id, -1)}
          disabled={minimum}
          style={[styles.boutonQuantite, minimum && styles.boutonDesactive]}
          accessibilityRole="button"
          accessibilityLabel="Diminuer la quantité"
        >
          <Text style={styles.boutonQuantiteTexte}>−</Text>
        </Pressable>

        <Text style={styles.quantite}>{ligne.quantite}</Text>

        <Pressable
          onPress={() => onChangerQuantite(ligne.id, 1)}
          disabled={maximum}
          style={[styles.boutonQuantite, maximum && styles.boutonDesactive]}
          accessibilityRole="button"
          accessibilityLabel="Augmenter la quantité"
        >
          <Text style={styles.boutonQuantiteTexte}>+</Text>
        </Pressable>

        <Text style={styles.sousTotal}>= {formaterPrix(ligne.prix * ligne.quantite)}</Text>

        <Pressable
          onPress={() => onRetirer(ligne.id)}
          style={styles.boutonRetirer}
          accessibilityRole="button"
        >
          <Text style={styles.boutonRetirerTexte}>Supprimer</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default memo(DetailPanier);
