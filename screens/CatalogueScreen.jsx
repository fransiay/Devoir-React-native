import {
  useState, useMemo, useRef, useEffect, useCallback, useContext,
} from 'react';
import {
  View, Text, FlatList, Pressable, ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { PanierContext } from '../context/PanierContext';
import { ProduitsContext } from '../context/ProduitsContext';
import { initDb, listerProduits, compterProduits } from '../database';
import BarreRecherche from '../components/BarreRecherche';
import ProduitCard from '../components/ProduitCard';
import { couleurs } from '../utils/couleurs';
import styles from './ProduitsStyles';

const TAILLE_PAGE = 10;

export const CatalogueScreen = () => {
  const { ajouter, quantites } = useContext(PanierContext);
  const { version } = useContext(ProduitsContext);

  // Le paramètre de navigation remplace ?categorie= de la version web
  const route = useRoute();
  const categorieActive = route.params?.categorie ?? null;

  const [saisie, setSaisie] = useState('');
  const [terme, setTerme] = useState('');
  const [favoris, setFavoris] = useState([]);

  const [produits, setProduits] = useState([]);
  const [total, setTotal] = useState(0);
  const [rechargement, setRechargement] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [rafraichissement, setRafraichissement] = useState(false);
  const [chargementPlus, setChargementPlus] = useState(false);
  const [erreur, setErreur] = useState(null);

  const inputRef = useRef(null);
  const generation = useRef(0);
  const lectureEnCours = useRef(false);

  // Anti-rebond : la recherche part 300 ms après la dernière frappe
  useEffect(() => {
    const timer = setTimeout(() => {
      setTerme(saisie);
    }, 300);

    return () => clearTimeout(timer);
  }, [saisie]);

  // Première page : relue dès qu'un filtre ou le catalogue change
  useEffect(() => {
    let actuel = true;
    generation.current += 1;

    const lire = async () => {
      try {
        await initDb();
        const filtres = { recherche: terme, categorie: categorieActive };
        const [lignes, nombre] = await Promise.all([
          listerProduits({ ...filtres, limite: TAILLE_PAGE, decalage: 0 }),
          compterProduits(filtres),
        ]);
        if (actuel) {
          setProduits(lignes);
          setTotal(nombre);
          setErreur(null);
        }
      } catch (e) {
        console.log(e);
        if (actuel) setErreur('Impossible de charger les produits');
      } finally {
        if (actuel) {
          setChargement(false);
          setRafraichissement(false);
        }
      }
    };

    lire();
    return () => {
      actuel = false;
    };
  }, [terme, categorieActive, version, rechargement]);

  const chargerPlus = async () => {
    if (lectureEnCours.current || produits.length >= total) return;

    const lecture = generation.current;
    lectureEnCours.current = true;
    setChargementPlus(true);
    try {
      const suite = await listerProduits({
        recherche: terme,
        categorie: categorieActive,
        limite: TAILLE_PAGE,
        decalage: produits.length,
      });
      // Un rechargement a eu lieu pendant la lecture : cette page est périmée
      if (lecture !== generation.current) return;
      setProduits((actuels) => [...actuels, ...suite]);
    } catch (e) {
      console.log(e);
    } finally {
      lectureEnCours.current = false;
      setChargementPlus(false);
    }
  };

  // Callback mémorisé : ProduitCard (memo) ne se réaffiche pas inutilement
  const toggleFavori = useCallback((id) => {
    setFavoris((prev) => (
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    ));
  }, []);

  const effacer = () => {
    setSaisie('');
    inputRef.current?.focus();
  };

  const rafraichir = () => {
    setRafraichissement(true);
    setRechargement((v) => v + 1);
  };

  const reessayer = () => {
    setChargement(true);
    setRechargement((v) => v + 1);
  };

  const renderItem = useCallback(({ item }) => (
    <ProduitCard
      produit={item}
      estFavori={favoris.includes(item.id)}
      onToggleFavori={toggleFavori}
      onAjouter={ajouter}
      quantite={quantites[item.id] ?? 0}
    />
  ), [favoris, quantites, toggleFavori, ajouter]);

  const donneesAffichage = useMemo(() => ({ favoris, quantites }), [favoris, quantites]);

  if (chargement) {
    return (
      <View style={[styles.ecran, styles.centre]}>
        <ActivityIndicator size="large" color={couleurs.principale} />
      </View>
    );
  }

  if (erreur) {
    return (
      <View style={[styles.ecran, styles.centre]}>
        <Text style={styles.messageErreur}>{erreur}</Text>
        <Pressable
          onPress={reessayer}
          style={({ pressed }) => [styles.bouton, pressed && styles.boutonPresse]}
          accessibilityRole="button"
        >
          <Text style={styles.boutonTexte}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.ecran}>
      {/* En-tête fixe : la recherche reste visible pendant le défilement */}
      <View style={[styles.liste, { paddingBottom: 0 }]}>
        <Text style={styles.titre}>Catalogue des produits</Text>

        {!!categorieActive && (
          <Text style={styles.filtre}>
            Filtre catégorie : <Text style={styles.filtreFort}>{categorieActive}</Text>
          </Text>
        )}

        <BarreRecherche
          valeur={saisie}
          onChange={setSaisie}
          onEffacer={effacer}
          inputRef={inputRef}
        />

        <Text style={styles.compteur}>
          {produits.length} / {total} résultat(s)
          {saisie !== terme ? ' – recherche en cours…' : ''}
        </Text>
      </View>

      <FlatList
        data={produits}
        extraData={donneesAffichage}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.vide}>
            {terme
              ? `Aucun produit ne correspond à « ${terme} ».`
              : 'Aucun produit dans cette catégorie.'}
          </Text>
        }
        ListFooterComponent={
          chargementPlus
            ? <ActivityIndicator style={styles.pied} color={couleurs.principale} />
            : null
        }
        refreshing={rafraichissement}
        onRefresh={rafraichir}
        onEndReached={chargerPlus}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.liste, { paddingTop: 0 }]}
      />
    </View>
  );
};
