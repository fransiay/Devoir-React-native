import { useContext, useMemo } from 'react';
import { Text, Pressable } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { ProduitsContext } from '../context/ProduitsContext';
import { normaliser } from '../utils/texte';
import Menu from './Menu';
import styles from './ComposantsStyles';

// La catégorie active est un paramètre de l'écran Catalogue (l'équivalent de ?categorie=)
const lireCategorieActive = (state) => {
  const principal = state.routes.find((r) => r.name === 'Menu Principal');
  const catalogue = principal?.state?.routes?.find((r) => r.name === 'Catalogue');
  return catalogue?.params?.categorie ?? null;
};

export default function Sidebar({ navigation, state }) {
  const { categories } = useContext(ProduitsContext);
  const catActive = lireCategorieActive(state);

  const liste = useMemo(() => ['Tous', ...categories], [categories]);

  const choisir = (cat) => {
    navigation.navigate('Menu Principal', {
      screen: 'Catalogue',
      params: { categorie: cat === 'Tous' ? null : cat },
    });
    navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView style={styles.sidebar} contentContainerStyle={styles.sidebarContenu}>
      <Text style={styles.sidebarTitre}>Catégories</Text>

      {liste.map((cat) => {
        const isTous = cat === 'Tous';
        const isActive = isTous
          ? !catActive
          : normaliser(catActive) === normaliser(cat);

        return (
          <Pressable
            key={cat}
            onPress={() => choisir(cat)}
            style={styles.categorie}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.categorieTexte, isActive && styles.categorieActive]}>{cat}</Text>
          </Pressable>
        );
      })}

      <Menu navigation={navigation} />
    </DrawerContentScrollView>
  );
}
