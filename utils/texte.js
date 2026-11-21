// Met en minuscules et retire les accents : "Écran" devient "ecran"
export function normaliser(texte) {
  return (texte ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

// 9.9 devient "9,90 €"
export const formaterPrix = (prix) => Number(prix).toFixed(2).replace('.', ',') + ' €';
