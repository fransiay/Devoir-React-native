import { getDb } from './connexion';
import { normaliser } from '../utils/texte';

// Catégories affichées dans la Sidebar de la version web
export const CATEGORIES_DE_BASE = ['Claviers', 'Souris', 'Écrans', 'Audio', 'Vidéo', 'Accessoires'];

const PRODUITS_DE_DEPART = [
  // Les 5 produits de la version web
  ['Clavier mécanique', 89, 'Claviers'],
  ['Souris sans fil', 35, 'Souris'],
  ['Écran 27 pouces', 249, 'Écrans'],
  ['Casque audio', 120, 'Audio'],
  ['Webcam HD', 59, 'Vidéo'],
  // Produits supplémentaires pour tester la pagination du TP
  ['Clavier compact', 65, 'Claviers'],
  ['Clavier sans fil', 49.9, 'Claviers'],
  ['Pavé numérique', 19.9, 'Claviers'],
  ['Souris gamer', 59.9, 'Souris'],
  ['Souris ergonomique', 44.5, 'Souris'],
  ['Trackball', 69, 'Souris'],
  ['Écran 24 pouces', 149, 'Écrans'],
  ['Écran incurvé 32 pouces', 399, 'Écrans'],
  ['Écran portable', 179, 'Écrans'],
  ['Enceintes de bureau', 79, 'Audio'],
  ['Écouteurs Bluetooth', 49, 'Audio'],
  ['Microphone USB', 89.9, 'Audio'],
  ['Webcam 4K', 129, 'Vidéo'],
  ['Carte de capture', 149.9, 'Vidéo'],
  ['Éclairage LED', 34.9, 'Vidéo'],
  ['Tapis de souris XL', 19, 'Accessoires'],
  ['Support pour écran', 39.9, 'Accessoires'],
  ['Hub USB-C', 29.9, 'Accessoires'],
  ['Câble HDMI 2 m', 12.5, 'Accessoires'],
];

// Images des produits de départ : 'Nom exact du produit': 'https://adresse/image.jpg'
const IMAGES = {
  'Carte de capture': 'https://m.media-amazon.com/images/I/71nUfJy9Z9L._AC_.jpg',
};

export const initProduits = async () => {
  const db = await getDb();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS produits (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      nom                 TEXT NOT NULL,
      nom_recherche       TEXT NOT NULL,
      prix                REAL NOT NULL,
      categorie           TEXT NOT NULL DEFAULT 'Divers',
      categorie_recherche TEXT NOT NULL DEFAULT 'divers'
    );
  `);

  // CREATE TABLE IF NOT EXISTS ne modifie pas une table déjà créée
  const colonnes = await db.getAllAsync('PRAGMA table_info(produits)');
  if (!colonnes.some((c) => c.name === 'image')) {
    await db.execAsync('ALTER TABLE produits ADD COLUMN image TEXT');
  }

  // On ne remplit la table que si elle est vide
  const { n } = await db.getFirstAsync('SELECT COUNT(*) AS n FROM produits');
  if (n === 0) {
    await db.withTransactionAsync(async () => {
      for (const [nom, prix, categorie] of PRODUITS_DE_DEPART) {
        await db.runAsync(
          `INSERT INTO produits (nom, nom_recherche, prix, categorie, categorie_recherche)
           VALUES (?, ?, ?, ?, ?)`,
          nom, normaliser(nom), prix, categorie, normaliser(categorie)
        );
      }
    });
  }

  // Ajoute les images aux produits qui n'en ont pas encore
  for (const [nom, url] of Object.entries(IMAGES)) {
    await db.runAsync('UPDATE produits SET image = ? WHERE nom = ? AND image IS NULL', url, nom);
  }
};

// Les colonnes *_recherche, sans accents, permettent à "ecran" de trouver "Écran"
const FILTRE = "nom_recherche LIKE ? ESCAPE '\\' AND (? IS NULL OR categorie_recherche = ?)";

const parametresFiltre = (recherche, categorie) => {
  // % et _ saisis par l'utilisateur sont cherchés comme de simples caractères
  const texte = normaliser(recherche).replace(/[\\%_]/g, '\\$&');
  const cat = categorie ? normaliser(categorie) : null;
  return [`%${texte}%`, cat, cat];
};

export const listerProduits = async ({
  recherche = '', categorie = null, limite = -1, decalage = 0,
} = {}) => {
  const db = await getDb();
  return db.getAllAsync(
    `SELECT id, nom, prix, categorie, image FROM produits
     WHERE ${FILTRE}
     ORDER BY nom_recherche, id
     LIMIT ? OFFSET ?`,
    ...parametresFiltre(recherche, categorie),
    limite,
    decalage
  );
};

export const compterProduits = async ({ recherche = '', categorie = null } = {}) => {
  const db = await getDb();
  const { n } = await db.getFirstAsync(
    `SELECT COUNT(*) AS n FROM produits WHERE ${FILTRE}`,
    ...parametresFiltre(recherche, categorie)
  );
  return n;
};

// Catégories de la Sidebar, plus celles ajoutées par l'administrateur
export const listerCategories = async () => {
  const db = await getDb();
  const lignes = await db.getAllAsync('SELECT DISTINCT categorie FROM produits ORDER BY categorie');

  const connues = new Set(CATEGORIES_DE_BASE.map(normaliser));
  const resultat = [...CATEGORIES_DE_BASE];
  for (const { categorie } of lignes) {
    const cle = normaliser(categorie);
    if (!connues.has(cle)) {
      connues.add(cle);
      resultat.push(categorie);
    }
  }
  return resultat;
};

// Équivalent du contrôle exigerAdmin du serveur web
const exigerAdmin = async (db, utilisateurId) => {
  const u = await db.getFirstAsync('SELECT role FROM utilisateurs WHERE id = ?', utilisateurId ?? 0);
  if (u?.role !== 'admin') throw new Error("Accès réservé à l'administrateur.");
};

export const insererProduit = async (utilisateurId, { nom, prix, categorie, image }) => {
  const db = await getDb();
  await exigerAdmin(db, utilisateurId);

  const cat = categorie?.trim() || 'Divers';
  const resultat = await db.runAsync(
    `INSERT INTO produits (nom, nom_recherche, prix, categorie, categorie_recherche, image)
     VALUES (?, ?, ?, ?, ?, ?)`,
    nom.trim(), normaliser(nom), prix, cat, normaliser(cat), image?.trim() || null
  );
  return resultat.lastInsertRowId;
};

export const supprimerProduitBase = async (utilisateurId, id) => {
  const db = await getDb();
  await exigerAdmin(db, utilisateurId);
  await db.runAsync('DELETE FROM produits WHERE id = ?', id);
};
