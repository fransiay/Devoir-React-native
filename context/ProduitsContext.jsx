import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { AuthContext } from './AuthContext';
import {
  initDb,
  listerCategories,
  insererProduit,
  supprimerProduitBase,
} from '../database';

export const ProduitsContext = createContext(null);

export function ProduitsProvider({ children }) {
  const { utilisateur } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  // version : compteur de rechargement du TP, incrémenté à chaque modification
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let actuel = true;

    initDb()
      .then(listerCategories)
      .then((liste) => {
        if (actuel) setCategories(liste);
      })
      .catch(console.log);

    return () => {
      actuel = false;
    };
  }, [version]);

  const ajouterProduit = useCallback(async (donnees) => {
    try {
      await insererProduit(utilisateur?.id, donnees);
      setVersion((v) => v + 1);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, message: e.message };
    }
  }, [utilisateur]);

  const supprimerProduit = useCallback(async (id) => {
    try {
      await supprimerProduitBase(utilisateur?.id, id);
      setVersion((v) => v + 1);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, message: e.message };
    }
  }, [utilisateur]);

  const value = useMemo(
    () => ({ categories, version, ajouterProduit, supprimerProduit }),
    [categories, version, ajouterProduit, supprimerProduit]
  );

  return <ProduitsContext.Provider value={value}>{children}</ProduitsContext.Provider>;
}
