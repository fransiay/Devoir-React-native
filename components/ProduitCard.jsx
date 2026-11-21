import { memo, useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formaterPrix } from '../utils/texte';
import { couleurs } from '../utils/couleurs';
import styles from './ComposantsStyles';

function ProduitCard({ produit, estFavori, onToggleFavori, onAjouter, quantite }) {
  // Vrai si l'image ne se charge pas (mauvaise adresse ou pas d'internet)
  const [erreurImage, setErreurImage] = useState(false);

  return (
    <View style={styles.carte}>
      {produit.image && !erreurImage ? (
        <Image
          source={{ uri: produit.image }}
          style={styles.carteImage}
          resizeMode="cover"
          accessibilityLabel={produit.nom}
          onError={() => setErreurImage(true)}
        />
      ) : (
        <View style={styles.carteSansImage}>
          <Ionicons name="image-outline" size={36} color={couleurs.texteDiscret} />
        </View>
      )}

      <Text style={styles.carteNom}>{produit.nom}</Text>
      <Text style={styles.cartePrix}>{formaterPrix(produit.prix)}</Text>
      {!!produit.categorie && (
        <Text style={styles.carteCategorie}>Catégorie : {produit.categorie}</Text>
      )}

      <View style={styles.carteActions}>
        <Pressable
          onPress={() => onAjouter(produit)}
          style={({ pressed }) => [styles.boutonAjouter, pressed && styles.boutonAjouterPresse]}
          accessibilityRole="button"
        >
          <Text style={styles.boutonAjouterTexte}>
            Ajouter au panier{quantite > 0 ? ` (${quantite})` : ''}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onToggleFavori(produit.id)}
          style={[styles.boutonFavori, estFavori && styles.boutonFavoriActif]}
          accessibilityRole="button"
          accessibilityState={{ selected: estFavori }}
        >
          <Text style={styles.boutonFavoriTexte}>{estFavori ? '★ Favori' : '☆ Ajouter'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

// Optimisation avec React.memo, comme dans la version web
export default memo(ProduitCard);
