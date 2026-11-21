import { View, Text, TextInput, Pressable } from 'react-native';
import { couleurs } from '../utils/couleurs';
import styles from './ComposantsStyles';

export default function BarreRecherche({ valeur, onChange, onEffacer, inputRef }) {
  return (
    <View style={styles.recherche}>
      <TextInput
        ref={inputRef}
        style={styles.rechercheChamp}
        placeholder="Rechercher un produit…"
        placeholderTextColor={couleurs.texteDiscret}
        autoCorrect={false}
        returnKeyType="search"
        value={valeur}
        onChangeText={onChange}
      />
      {valeur !== '' && (
        <Pressable onPress={onEffacer} style={styles.rechercheBouton} accessibilityRole="button">
          <Text style={styles.rechercheBoutonTexte}>Effacer</Text>
        </Pressable>
      )}
    </View>
  );
}
