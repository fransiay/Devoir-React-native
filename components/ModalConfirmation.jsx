import { Modal, View, Text, Pressable } from 'react-native';
import styles from './ComposantsStyles';

export default function ModalConfirmation({
  visible,
  titre,
  message,
  libelleConfirmer = 'Confirmer',
  libelleAnnuler = 'Annuler',
  onConfirmer,
  onAnnuler,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onAnnuler} // Bouton retour Android
    >
      <View style={styles.modalVoile}>
        {/* Un appui en dehors de la fenêtre annule */}
        <Pressable
          style={styles.modalFond}
          onPress={onAnnuler}
          accessibilityRole="button"
          accessibilityLabel={libelleAnnuler}
        />

        <View style={styles.modalCarte} accessibilityViewIsModal>
          <Text style={styles.modalTitre}>{titre}</Text>
          <Text style={styles.modalMessage}>{message}</Text>

          <View style={styles.modalActions}>
            <Pressable
              onPress={onAnnuler}
              style={styles.modalBoutonAnnuler}
              accessibilityRole="button"
            >
              <Text style={styles.modalBoutonAnnulerTexte}>{libelleAnnuler}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirmer}
              style={styles.modalBoutonConfirmer}
              accessibilityRole="button"
            >
              <Text style={styles.modalBoutonConfirmerTexte}>{libelleConfirmer}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
