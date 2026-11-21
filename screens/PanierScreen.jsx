import { useContext, useCallback, useState } from 'react';
import {
  View, Text, FlatList, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PanierContext } from '../context/PanierContext';
import DetailPanier from '../components/DetailPanier';
import ModalConfirmation from '../components/ModalConfirmation';
import { formaterPrix } from '../utils/texte';
import styles from './ProduitsStyles';

export const PanierScreen = () => {
  const {
    lignes, total, changerQuantite, retirer, vider, QUANTITE_MAX,
  } = useContext(PanierContext);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const allerAuCatalogue = () => navigation.navigate('Catalogue');

  const confirmerVider = () => {
    setModalVisible(false);
    vider();
  };

  const renderItem = useCallback(({ item }) => (
    <DetailPanier
      ligne={item}
      max={QUANTITE_MAX}
      onChangerQuantite={changerQuantite}
      onRetirer={retirer}
    />
  ), [QUANTITE_MAX, changerQuantite, retirer]);

  if (lignes.length === 0) {
    return (
      <View style={[styles.ecran, styles.liste]}>
        <Text style={styles.titre}>Votre Panier</Text>
        <Text style={styles.vide}>Votre panier est actuellement vide.</Text>
        <Pressable
          onPress={allerAuCatalogue}
          style={({ pressed }) => [
            styles.bouton,
            styles.debutPanier,
            pressed && styles.boutonPresse,
          ]}
          accessibilityRole="link"
        >
          <Text style={styles.boutonTexte}>Retourner au catalogue</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.ecran}>
      <FlatList
        data={lignes}
        keyExtractor={(l) => String(l.id)}
        renderItem={renderItem}
        ListHeaderComponent={<Text style={styles.titre}>Votre Panier</Text>}
        ListFooterComponent={
          <View>
            <Text style={styles.total}>Total de la commande : {formaterPrix(total)}</Text>
            <View style={styles.actions}>
              <Pressable
                onPress={() => setModalVisible(true)}
                style={[styles.bouton, styles.boutonDanger]}
                accessibilityRole="button"
              >
                <Text style={styles.boutonTexte}>Vider le panier</Text>
              </Pressable>
              <Pressable
                onPress={allerAuCatalogue}
                style={({ pressed }) => [styles.bouton, pressed && styles.boutonPresse]}
                accessibilityRole="link"
              >
                <Text style={styles.boutonTexte}>Continuer mes achats</Text>
              </Pressable>
            </View>
          </View>
        }
        contentContainerStyle={styles.liste}
      />

      <ModalConfirmation
        visible={modalVisible}
        titre="Vider le panier"
        message="Voulez-vous vraiment vider votre panier ?"
        libelleConfirmer="Vider"
        onConfirmer={confirmerVider}
        onAnnuler={() => setModalVisible(false)}
      />
    </View>
  );
};
