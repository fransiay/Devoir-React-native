const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Retire les chiffres et caractères spéciaux d'un nom ou d'un prénom
export function nettoyerNom(value) {
  return (value ?? '').replace(/[^\p{L}\s'-]/gu, '');
}

// Renvoie un objet { champ: message } ; un objet vide signifie que tout est valide
export function validerInscription(form) {
  const erreurs = {};

  if (!form.nom || !form.nom.trim()) {
    erreurs.nom = 'Le nom est obligatoire.';
  }
  if (!form.prenom || !form.prenom.trim()) {
    erreurs.prenom = 'Le prénom est obligatoire.';
  }
  if (!form.email || !REGEX_EMAIL.test(form.email.trim())) {
    erreurs.email = 'Saisis une adresse e-mail valide.';
  }
  if (!form.password) {
    erreurs.password = 'Le mot de passe est obligatoire.';
  }
  if (form.confirmation !== form.password) {
    erreurs.confirmation = 'Les mots de passe ne correspondent pas.';
  }
  if (!form.cgu) {
    erreurs.cgu = "Tu dois accepter les conditions d'utilisation.";
  }

  return erreurs;
}

// Le clavier français peut saisir une virgule : "9,90" devient 9.9
export const lirePrix = (texte) => Number(String(texte).trim().replace(',', '.'));

// Renvoie un message d'erreur, ou null si le produit est valide
export function validerProduit(form) {
  if (!form.nom.trim()) return 'Le nom du produit est obligatoire.';

  const prix = lirePrix(form.prix);
  if (form.prix.trim() === '' || Number.isNaN(prix) || prix < 0) {
    return 'Le prix doit être un nombre positif.';
  }
  return null;
}
