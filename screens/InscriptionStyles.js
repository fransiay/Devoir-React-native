import { StyleSheet } from 'react-native';
import { couleurs } from '../utils/couleurs';

// Styles partagés par la connexion et l'inscription
export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: couleurs.fondColonne },
  flex: { flex: 1 },
  contenu: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  form: {
    backgroundColor: couleurs.blanc,
    borderWidth: 1,
    borderColor: couleurs.bordure,
    borderRadius: 8,
    padding: 24,
  },
  marque: {
    fontSize: 28,
    fontWeight: '700',
    color: couleurs.principale,
    textAlign: 'center',
    marginBottom: 16,
  },
  titre: {
    fontSize: 24,
    fontWeight: '700',
    color: couleurs.principale,
    textAlign: 'center',
    marginBottom: 20,
  },
  groupe: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', color: couleurs.texte, marginBottom: 6 },
  champ: {
    borderWidth: 1,
    borderColor: couleurs.bordure,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: couleurs.texte,
    backgroundColor: couleurs.blanc,
  },
  champErreur: { borderColor: couleurs.erreur },
  erreur: { color: couleurs.erreur, fontSize: 13, marginTop: 4 },
  erreurGenerale: { color: couleurs.erreur, fontSize: 14, marginBottom: 12 },
  succes: { color: couleurs.succes, fontSize: 14, marginBottom: 12 },
  ligneSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  libelle: { flex: 1, fontSize: 14, color: couleurs.texte, paddingRight: 12 },
  bouton: {
    backgroundColor: couleurs.principale,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  boutonPresse: { backgroundColor: couleurs.principalePressee },
  boutonDesactive: { opacity: 0.6 },
  boutonTexte: { color: couleurs.blanc, fontSize: 16, fontWeight: '600' },
  zoneLien: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 },
  lienTexte: { fontSize: 14, color: couleurs.texte },
  lien: {
    fontSize: 14,
    color: couleurs.principale,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
