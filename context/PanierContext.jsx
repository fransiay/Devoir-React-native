import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { AuthContext } from './AuthContext';
import { ProduitsContext } from './ProduitsContext';
import {
  initDb,
  lirePanier,
  ajouterAuPanier,
  modifierQuantitePanier,
  retirerDuPanier,
  viderPanier,
} from '../database';

export const PanierContext = createContext(null);

export const QUANTITE_MAX = 10;

function PanierInterne({ utilisateurId, children }) {
  const { version } = useContext(ProduitsContext);
  const [lignes, setLignes] = useState([]);

  // Lecture du panier à la connexion et après une modification du catalogue
  useEffect(() => {
    if (!utilisateurId) return undefined;
    let actuel = true;

    initDb()
      .then(() => lirePanier(utilisateurId))
      .then((resultat) => {
        if (actuel) setLignes(resultat);
      })
      .catch(console.log);

    return () => {
      actuel = false;
    };
  }, [utilisateurId, version]);

  const ajouter = useCallback((produit) => {
    setLignes((prev) => {
      const existante = prev.find((l) => l.id === produit.id);
      if (!existante) {
        return [...prev, { id: produit.id, nom: produit.nom, prix: produit.prix, quantite: 1 }];
      }
      if (existante.quantite >= QUANTITE_MAX) return prev;
      return prev.map((l) => (l.id === produit.id ? { ...l, quantite: l.quantite + 1 } : l));
    });
    if (utilisateurId) {
      ajouterAuPanier(utilisateurId, produit.id, QUANTITE_MAX).catch(console.log);
    }
  }, [utilisateurId]);

  const changerQuantite = useCallback((id, variation) => {
    setLignes((prev) => prev.map((l) => (
      l.id === id
        ? { ...l, quantite: Math.min(QUANTITE_MAX, Math.max(1, l.quantite + variation)) }
        : l
    )));
    if (utilisateurId) {
      modifierQuantitePanier(utilisateurId, id, variation, QUANTITE_MAX).catch(console.log);
    }
  }, [utilisateurId]);

  const retirer = useCallback((id) => {
    setLignes((prev) => prev.filter((l) => l.id !== id));
    if (utilisateurId) retirerDuPanier(utilisateurId, id).catch(console.log);
  }, [utilisateurId]);

  const vider = useCallback(() => {
    setLignes([]);
    if (utilisateurId) viderPanier(utilisateurId).catch(console.log);
  }, [utilisateurId]);

  // Valeurs dérivées mémorisées avec useMemo
  const nombreArticles = useMemo(
    () => lignes.reduce((somme, l) => somme + l.quantite, 0),
    [lignes]
  );

  const total = useMemo(
    () => lignes.reduce((somme, l) => somme + l.prix * l.quantite, 0),
    [lignes]
  );

  const quantites = useMemo(() => {
    const resultat = {};
    for (const l of lignes) {
      resultat[l.id] = l.quantite;
    }
    return resultat;
  }, [lignes]);

  const value = useMemo(() => ({
    lignes,
    quantites,
    nombreArticles,
    total,
    ajouter,
    changerQuantite,
    retirer,
    vider,
    QUANTITE_MAX,
  }), [lignes, quantites, nombreArticles, total, ajouter, changerQuantite, retirer, vider]);

  return <PanierContext.Provider value={value}>{children}</PanierContext.Provider>;
}

// La clé recrée le panier quand l'utilisateur change, comme dans la version web
export function PanierProvider({ children }) {
  const { utilisateur } = useContext(AuthContext);
  const utilisateurId = utilisateur?.id ?? null;

  return (
    <PanierInterne key={utilisateurId ?? 'anonyme'} utilisateurId={utilisateurId}>
      {children}
    </PanierInterne>
  );
}
