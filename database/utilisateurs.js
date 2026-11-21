import { getDb } from './connexion';

const COLONNES = 'id, login, nom, role';

export const insererUtilisateur = async ({ login, motDePasse, nom }) => {
  const db = await getDb();
  const resultat = await db.runAsync(
    "INSERT INTO utilisateurs (login, nom, mot_de_passe, role) VALUES (?, ?, ?, 'client')",
    login.trim().toLowerCase(),
    nom.trim(),
    motDePasse
  );
  return db.getFirstAsync(
    `SELECT ${COLONNES} FROM utilisateurs WHERE id = ?`,
    resultat.lastInsertRowId
  );
};

// Renvoie l'utilisateur si le login et le mot de passe correspondent, sinon null
export const verifierConnexion = async (login, motDePasse) => {
  const db = await getDb();
  return db.getFirstAsync(
    `SELECT ${COLONNES} FROM utilisateurs WHERE login = ? AND mot_de_passe = ?`,
    login.trim().toLowerCase(),
    motDePasse
  );
};

// La session remplace le localStorage de la version web
export const lireSession = async () => {
  const db = await getDb();
  return db.getFirstAsync(
    `SELECT u.id, u.login, u.nom, u.role
     FROM session s JOIN utilisateurs u ON u.id = s.utilisateur_id
     WHERE s.id = 1`
  );
};

export const ecrireSession = async (utilisateurId) => {
  const db = await getDb();
  await db.runAsync(
    'INSERT OR REPLACE INTO session (id, utilisateur_id) VALUES (1, ?)',
    utilisateurId
  );
};

export const effacerSession = async () => {
  const db = await getDb();
  await db.runAsync('DELETE FROM session');
};
