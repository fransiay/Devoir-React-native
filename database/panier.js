import { getDb } from './connexion';

// Le panier est propre à chaque utilisateur, comme la clé "panier-login" du web
export const lirePanier = async (utilisateurId) => {
  const db = await getDb();
  return db.getAllAsync(
    `SELECT p.id, p.nom, p.prix, l.quantite
     FROM panier l JOIN produits p ON p.id = l.produit_id
     WHERE l.utilisateur_id = ?
     ORDER BY l.rowid`,
    utilisateurId
  );
};

export const ajouterAuPanier = async (utilisateurId, produitId, max) => {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO panier (utilisateur_id, produit_id, quantite) VALUES (?, ?, 1)
     ON CONFLICT (utilisateur_id, produit_id)
     DO UPDATE SET quantite = MIN(?, quantite + 1)`,
    utilisateurId, produitId, max
  );
};

export const modifierQuantitePanier = async (utilisateurId, produitId, variation, max) => {
  const db = await getDb();
  await db.runAsync(
    `UPDATE panier SET quantite = MIN(?, MAX(1, quantite + ?))
     WHERE utilisateur_id = ? AND produit_id = ?`,
    max, variation, utilisateurId, produitId
  );
};

export const retirerDuPanier = async (utilisateurId, produitId) => {
  const db = await getDb();
  await db.runAsync(
    'DELETE FROM panier WHERE utilisateur_id = ? AND produit_id = ?',
    utilisateurId, produitId
  );
};

export const viderPanier = async (utilisateurId) => {
  const db = await getDb();
  await db.runAsync('DELETE FROM panier WHERE utilisateur_id = ?', utilisateurId);
};
