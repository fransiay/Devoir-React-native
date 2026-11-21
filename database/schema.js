import { getDb } from './connexion';
import { initProduits } from './produits';

const creerBase = async () => {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS utilisateurs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      login        TEXT NOT NULL UNIQUE,
      nom          TEXT NOT NULL,
      mot_de_passe TEXT NOT NULL,
      role         TEXT NOT NULL DEFAULT 'client'
    );

    CREATE TABLE IF NOT EXISTS session (
      id             INTEGER PRIMARY KEY CHECK (id = 1),
      utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE
    );
  `);

  // Compte administrateur de la version web, créé une seule fois
  const admin = await db.getFirstAsync("SELECT id FROM utilisateurs WHERE role = 'admin' LIMIT 1");
  if (!admin) {
    await db.runAsync(
      "INSERT INTO utilisateurs (login, nom, mot_de_passe, role) VALUES (?, ?, ?, 'admin')",
      'admin@site.fr',
      'Administrateur',
      'admin123'
    );
  }

  await initProduits();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS panier (
      utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
      produit_id     INTEGER NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
      quantite       INTEGER NOT NULL,
      PRIMARY KEY (utilisateur_id, produit_id)
    );
  `);
};

let initPromise = null;

// Plusieurs écrans appellent initDb : la création n'est lancée qu'une fois
export const initDb = () => {
  if (!initPromise) {
    initPromise = creerBase().catch((e) => {
      initPromise = null;
      throw e;
    });
  }
  return initPromise;
};
