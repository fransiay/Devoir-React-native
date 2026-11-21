import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  initDb,
  verifierConnexion,
  insererUtilisateur,
  lireSession,
  ecrireSession,
  effacerSession,
} from '../database';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // useState : l'utilisateur connecté (null si personne), avec son rôle
  const [utilisateur, setUtilisateur] = useState(null);
  // useState : vrai tant qu'on n'a pas fini de relire la session sauvegardée
  const [chargement, setChargement] = useState(true);

  // useEffect : au montage seulement, on restaure la session depuis SQLite
  useEffect(() => {
    let actuel = true;

    const restaurer = async () => {
      try {
        await initDb();
        const session = await lireSession();
        if (actuel && session) setUtilisateur(session);
      } catch (e) {
        console.log('Erreur lors de la lecture de la session :', e);
      } finally {
        if (actuel) setChargement(false);
      }
    };

    restaurer();
    return () => {
      actuel = false;
    };
  }, []);

  // useCallback : renvoie { ok, user?, message? }
  const connecter = useCallback(async (login, motDePasse) => {
    try {
      await initDb();
      const user = await verifierConnexion(login, motDePasse);
      if (!user) return { ok: false, message: 'Identifiant ou mot de passe incorrect.' };

      await ecrireSession(user.id);
      setUtilisateur(user);
      return { ok: true, user };
    } catch (e) {
      console.log(e);
      return { ok: false, message: 'Connexion impossible, veuillez réessayer.' };
    }
  }, []);

  // useCallback : inscrit un nouveau client, puis le connecte
  const inscrire = useCallback(async (donnees) => {
    try {
      await initDb();
      const user = await insererUtilisateur(donnees);
      await ecrireSession(user.id);
      setUtilisateur(user);
      return { ok: true, user };
    } catch (e) {
      console.log(e);
      if (String(e.message).includes('UNIQUE')) {
        return { ok: false, message: 'Un compte existe déjà avec cet e-mail.' };
      }
      return { ok: false, message: "Impossible d'enregistrer l'utilisateur." };
    }
  }, []);

  // useCallback : déconnecter (identité stable)
  const deconnecter = useCallback(async () => {
    setUtilisateur(null);
    try {
      await effacerSession();
    } catch (e) {
      console.log(e);
    }
  }, []);

  // useMemo : valeur du contexte mémorisée pour éviter des réaffichages inutiles
  const value = useMemo(() => ({
    utilisateur,
    estConnecte: utilisateur !== null,
    estAdmin: utilisateur?.role === 'admin',
    role: utilisateur?.role ?? null,
    chargement,
    connecter,
    inscrire,
    deconnecter,
  }), [utilisateur, chargement, connecter, inscrire, deconnecter]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
