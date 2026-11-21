import { useState, useRef, useEffect, useContext } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { couleurs } from '../utils/couleurs';
import styles from './InscriptionStyles';

export const LoginScreen = ({ onAllerInscription }) => {
  const { connecter } = useContext(AuthContext);

  const [login, setLogin] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  const loginRef = useRef(null);
  const motDePasseRef = useRef(null);

  useEffect(() => {
    loginRef.current?.focus();
  }, []);

  const seConnecter = async () => {
    if (!login.trim() || !motDePasse || envoi) return;

    setEnvoi(true);
    setErreur('');
    const res = await connecter(login, motDePasse);
    // En cas de succès, App.js remplace cet écran par la navigation
    if (!res.ok) {
      setErreur(res.message);
      setMotDePasse('');
      setEnvoi(false);
    }
  };

  const desactive = !login.trim() || !motDePasse || envoi;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          <Text style={styles.marque}>Waza Shop</Text>

          <View style={styles.form}>
            <Text style={styles.titre}>Authentification</Text>

            <View style={styles.groupe}>
              <Text style={styles.label}>Identifiant</Text>
              <TextInput
                ref={loginRef}
                style={styles.champ}
                placeholder="nom@exemple.fr"
                placeholderTextColor={couleurs.texteDiscret}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                value={login}
                onChangeText={setLogin}
                onSubmitEditing={() => motDePasseRef.current?.focus()}
              />
            </View>

            <View style={styles.groupe}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                ref={motDePasseRef}
                style={styles.champ}
                placeholder="••••••"
                placeholderTextColor={couleurs.texteDiscret}
                secureTextEntry
                returnKeyType="done"
                value={motDePasse}
                onChangeText={setMotDePasse}
                onSubmitEditing={seConnecter}
              />
            </View>

            {erreur !== '' && <Text style={styles.erreurGenerale}>{erreur}</Text>}

            <Pressable
              onPress={seConnecter}
              disabled={desactive}
              style={({ pressed }) => [
                styles.bouton,
                pressed && styles.boutonPresse,
                desactive && styles.boutonDesactive,
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.boutonTexte}>Se Connecter</Text>
            </Pressable>

            <View style={styles.zoneLien}>
              <Text style={styles.lienTexte}>Pas encore de compte ? </Text>
              <Pressable onPress={onAllerInscription} accessibilityRole="link">
                <Text style={styles.lien}>Créer un compte</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
