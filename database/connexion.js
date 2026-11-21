import * as SQLite from 'expo-sqlite';

let dbPromise = null;

// La base n'est ouverte qu'une seule fois
export const getDb = () => {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('wazashop.db');
  return dbPromise;
};
