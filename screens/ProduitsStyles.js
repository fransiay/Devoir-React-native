import { StyleSheet } from 'react-native';
import { couleurs } from '../utils/couleurs';

// Styles du catalogue, du panier et de l'espace administrateur
export default StyleSheet.create({
  ecran: { flex: 1, backgroundColor: couleurs.blanc },
  centre: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  liste: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  listeVide: { flexGrow: 1 },
  titre: { fontSize: 22, fontWeight: '700', color: couleurs.texte },
  filtre: { fontSize: 14, color: couleurs.principale, marginTop: 8 },
  filtreFort: { fontWeight: '700' },
  compteur: { fontSize: 14, color: couleurs.texteSecondaire, marginVertical: 8 },
  vide: { fontSize: 15, color: couleurs.texte, marginVertical: 16 },
  pied: { paddingVertical: 16 },
  messageErreur: {
    color: couleurs.erreur,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
  },
  erreurLigne: { color: couleurs.erreur, fontSize: 14, marginBottom: 12 },

  bouton: {
    backgroundColor: couleurs.principale,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  boutonPresse: { backgroundColor: couleurs.principalePressee },
  boutonDanger: { backgroundColor: couleurs.erreur },
  boutonTexte: { color: couleurs.blanc, fontSize: 14, fontWeight: '600' },

  // Panier
  total: { fontSize: 18, fontWeight: '700', color: couleurs.texte, marginTop: 20 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  debutPanier: { alignSelf: 'flex-start', marginTop: 4 },

  // Administration
  form: {
    backgroundColor: couleurs.fondFormulaire,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    marginBottom: 16,
  },
  groupe: { marginBottom: 10 },
  label: { fontSize: 13, fontWeight: '700', color: couleurs.texte, marginBottom: 4 },
  champ: {
    backgroundColor: couleurs.blanc,
    borderWidth: 1,
    borderColor: couleurs.bordure,
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    color: couleurs.texte,
  },
  ligneProduit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: couleurs.blanc,
    borderWidth: 1,
    borderColor: couleurs.bordureListe,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  ligneProduitTexte: { flex: 1, paddingRight: 10 },
  produitNom: { fontSize: 15, fontWeight: '700', color: couleurs.texte },
  produitInfo: { fontSize: 14, color: couleurs.texte, marginTop: 2 },
  produitCategorie: { fontSize: 12, color: couleurs.texteDiscret },
  boutonSupprimer: {
    backgroundColor: couleurs.erreur,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  boutonSupprimerTexte: { color: couleurs.blanc, fontSize: 13 },
});
