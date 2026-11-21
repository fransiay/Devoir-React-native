import {
  useState, useRef, useEffect, useContext, useCallback,
} from 'react';
import {
  View, Text, TextInput, FlatList, Pressable,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { ProduitsContext } from '../context/ProduitsContext';
import { initDb, listerProduits } from '../database';
import { validerProduit, lirePrix } from '../utils/validation';
import { formaterPrix } from '../utils/texte';
import { couleurs } from '../utils/couleurs';
import styles from './ProduitsStyles';

const FORMULAIRE_VIDE = { nom: '', prix: '', categorie: '', image: '' };

export const AdminProduitsScreen = () => {
  const { version, ajouterProduit, supprimerProduit } = useContext(ProduitsContext);

  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState(FORMULAIRE_VIDE);
  const [erreur, setErreur] = useState('');

  const nomRef = useRef(null);

  useEffect(() => {
    nomRef.current?.focus();
  }, []);

  // La liste est relue après chaque ajout ou suppression
  useEffect(() => {
    let actuel = true;

    initDb()
      .then(() => listerProduits())
      .then((lignes) => {
        if (actuel) setProduits(lignes);
      })
      .catch((e) => {
        console.log(e);
        if (actuel) setErreur('Impossible de charger les produits.');
      });

    return () => {
      actuel = false;
    };
  }, [version]);

  const maj = useCallback((champ, valeur) => {
    setForm((prev) => ({ ...prev, [champ]: valeur }));
  }, []);

  const envoyer = async () => {
    const message = validerProduit(form);
    if (message) {
      setErreur(message);
      return;
    }

    const res = await ajouterProduit({
      nom: form.nom.trim(),
      prix: lirePrix(form.prix),
      categorie: form.categorie.trim() || 'Divers',
      image: form.image,
    });

    if (!res.ok) {
      setErreur(res.message || "Impossible d'ajouter le produit.");
      return;
    }

    setForm(FORMULAIRE_VIDE);
    setErreur('');
    nomRef.current?.focus();
  };

  const supprimer = useCallback(async (id) => {
    const res = await supprimerProduit(id);
    setErreur(res.ok ? '' : res.message || 'Impossible de supprimer le produit.');
  }, [supprimerProduit]);

  const renderItem = useCallback(({ item: p }) => (
    <View style={styles.ligneProduit}>
      <View style={styles.ligneProduitTexte}>
        <Text style={styles.produitNom}>{p.nom}</Text>
        <Text style={styles.produitInfo}>
          {formaterPrix(p.prix)} <Text style={styles.produitCategorie}>({p.categorie})</Text>
        </Text>
      </View>
      <Pressable
        onPress={() => supprimer(p.id)}
        style={styles.boutonSupprimer}
        accessibilityRole="button"
        accessibilityLabel={`Supprimer ${p.nom}`}
      >
        <Text style={styles.boutonSupprimerTexte}>Supprimer</Text>
      </Pressable>
    </View>
  ), [supprimer]);

  return (
    <KeyboardAvoidingView
      style={styles.ecran}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={produits}
        keyExtractor={(p) => String(p.id)}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.liste}
        ListHeaderComponent={
          <View>
            <Text style={styles.titre}>Espace administrateur — Produits</Text>

            <View style={styles.form}>
              <View style={styles.groupe}>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                  ref={nomRef}
                  style={styles.champ}
                  placeholder="ex: Clavier gamer"
                  placeholderTextColor={couleurs.texteDiscret}
                  value={form.nom}
                  onChangeText={(t) => maj('nom', t)}
                />
              </View>

              <View style={styles.groupe}>
                <Text style={styles.label}>Prix (€)</Text>
                <TextInput
                  style={styles.champ}
                  placeholder="ex: 99"
                  placeholderTextColor={couleurs.texteDiscret}
                  keyboardType="decimal-pad"
                  value={form.prix}
                  onChangeText={(t) => maj('prix', t)}
                />
              </View>

              <View style={styles.groupe}>
                <Text style={styles.label}>Catégorie</Text>
                <TextInput
                  style={styles.champ}
                  placeholder="ex: Claviers"
                  placeholderTextColor={couleurs.texteDiscret}
                  value={form.categorie}
                  onChangeText={(t) => maj('categorie', t)}
                />
              </View>

              <View style={styles.groupe}>
                <Text style={styles.label}>Image (URL)</Text>
                <TextInput
                  style={styles.champ}
                  placeholder="https://..."
                  placeholderTextColor={couleurs.texteDiscret}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={form.image}
                  onChangeText={(t) => maj('image', t)}
                />
              </View>

              <Pressable
                onPress={envoyer}
                style={({ pressed }) => [styles.bouton, pressed && styles.boutonPresse]}
                accessibilityRole="button"
              >
                <Text style={styles.boutonTexte}>Ajouter</Text>
              </Pressable>
            </View>

            {erreur !== '' && <Text style={styles.erreurLigne}>{erreur}</Text>}

            <Text style={styles.compteur}>{produits.length} produit(s) dans le catalogue</Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};
