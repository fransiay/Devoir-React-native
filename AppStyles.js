import { StyleSheet } from 'react-native';
import { couleurs } from './utils/couleurs';

export default StyleSheet.create({
  racine: { flex: 1, backgroundColor: couleurs.blanc },
  chargement: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: couleurs.blanc,
  },
  texteChargement: { marginTop: 12, fontSize: 15, color: couleurs.texteSecondaire },
});
