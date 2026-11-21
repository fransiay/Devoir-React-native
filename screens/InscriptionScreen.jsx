import { useState, useRef, useEffect, useContext } from 'react';
import {
  View, Text, TextInput, Switch, Pressable, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { validerInscription, nettoyerNom } from '../utils/validation';
import { couleurs } from '../utils/couleurs';
import styles from './InscriptionStyles';

const CHAMPS_NOM = ['nom', 'prenom'];

export const InscriptionScreen = ({ onAllerConnexion }) => {
  const { inscrire } = useContext(AuthContext);

  // Un seul état objet pour tous les champs du formulaire
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmation: '',
    cgu: false,
  });
  const [erreur, setErreur] = useState('');
  const [erreurs, setErreurs] = useState({});
  const [envoi, setEnvoi] = useState(false);

  const nomRef = useRef(null);

  useEffect(() => {
    nomRef.current?.focus();
  }, []);

  const maj = (champ, valeur) => {
    let nouvelleValeur = valeur;
    let messageChamp;

    // Pour le nom et le prénom, on retire les chiffres et caractères spéciaux
    if (CHAMPS_NOM.includes(champ)) {
      nouvelleValeur = nettoyerNom(valeur);
      if (nouvelleValeur !== valeur) {
        messageChamp = 'Chiffres et caractères spéciaux interdits.';
      }
    }

    setForm((prev) => ({ ...prev, [champ]: nouvelleValeur }));
    setErreurs((prev) => ({ ...prev, [champ]: messageChamp }));
  };

  const envoyer = async () => {
    if (envoi) return;

    const erreursForm = validerInscription(form);
    setErreurs(erreursForm);
    if (Object.keys(erreursForm).length > 0) {
      setErreur('');
      return;
    }

    setEnvoi(true);
    // L'e-mail sert d'identifiant, comme dans la version web
    const res = await inscrire({
      login: form.email,
      motDePasse: form.password,
      nom: `${form.prenom.trim()} ${form.nom.trim()}`,
    });

    // En cas de succès, App.js remplace cet écran par la navigation
    if (!res.ok) {
      setErreur(res.message);
      setEnvoi(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <Text style={styles.titre}>Créer un compte</Text>

            <View style={styles.groupe}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                ref={nomRef}
                style={[styles.champ, erreurs.nom && styles.champErreur]}
                placeholder="Dupont"
                placeholderTextColor={couleurs.texteDiscret}
                autoCapitalize="words"
                value={form.nom}
                onChangeText={(t) => maj('nom', t)}
              />
              {!!erreurs.nom && <Text style={styles.erreur}>{erreurs.nom}</Text>}
            </View>

            <View style={styles.groupe}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={[styles.champ, erreurs.prenom && styles.champErreur]}
                placeholder="Marie"
                placeholderTextColor={couleurs.texteDiscret}
                autoCapitalize="words"
                value={form.prenom}
                onChangeText={(t) => maj('prenom', t)}
              />
              {!!erreurs.prenom && <Text style={styles.erreur}>{erreurs.prenom}</Text>}
            </View>

            <View style={styles.groupe}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.champ, erreurs.email && styles.champErreur]}
                placeholder="nom@exemple.fr"
                placeholderTextColor={couleurs.texteDiscret}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={form.email}
                onChangeText={(t) => maj('email', t)}
              />
              {!!erreurs.email && <Text style={styles.erreur}>{erreurs.email}</Text>}
            </View>

            <View style={styles.groupe}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={[styles.champ, erreurs.password && styles.champErreur]}
                placeholder="••••••"
                placeholderTextColor={couleurs.texteDiscret}
                secureTextEntry
                value={form.password}
                onChangeText={(t) => maj('password', t)}
              />
              {!!erreurs.password && <Text style={styles.erreur}>{erreurs.password}</Text>}
            </View>

            <View style={styles.groupe}>
              <Text style={styles.label}>Confirmer le mot de passe</Text>
              <TextInput
                style={[styles.champ, erreurs.confirmation && styles.champErreur]}
                placeholder="••••••"
                placeholderTextColor={couleurs.texteDiscret}
                secureTextEntry
                value={form.confirmation}
                onChangeText={(t) => maj('confirmation', t)}
              />
              {!!erreurs.confirmation && <Text style={styles.erreur}>{erreurs.confirmation}</Text>}
            </View>

            <View style={styles.groupe}>
              <View style={styles.ligneSwitch}>
                <Text style={styles.libelle}>J'accepte les conditions d'utilisation</Text>
                <Switch
                  value={form.cgu}
                  onValueChange={(v) => maj('cgu', v)}
                  trackColor={{ true: couleurs.principalePressee, false: couleurs.bordure }}
                  thumbColor={form.cgu ? couleurs.principale : couleurs.blanc}
                />
              </View>
              {!!erreurs.cgu && <Text style={styles.erreur}>{erreurs.cgu}</Text>}
            </View>

            {erreur !== '' && <Text style={styles.erreurGenerale}>{erreur}</Text>}

            <Pressable
              onPress={envoyer}
              disabled={envoi}
              style={({ pressed }) => [
                styles.bouton,
                pressed && styles.boutonPresse,
                envoi && styles.boutonDesactive,
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.boutonTexte}>S'inscrire</Text>
            </Pressable>

            <View style={styles.zoneLien}>
              <Text style={styles.lienTexte}>Déjà un compte ? </Text>
              <Pressable onPress={onAllerConnexion} accessibilityRole="link">
                <Text style={styles.lien}>Se Connecter</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
