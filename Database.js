import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('little_lemon.db');

const setupDatabaseAsync = async () => {
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS menu (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT,
          description TEXT,
          price REAL,
          image TEXT
        );`,
        [],
        () => { resolve(); },
        (_, error) => { reject(error); }
      );
    });
  });
};

const storeDataInDbAsync = async (items) => {
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      items.forEach(item => {
        tx.executeSql(
          'INSERT INTO menu (name, description, price, image) VALUES (?, ?, ?, ?);',
          [item.name, item.description, item.price, item.image],
          () => { resolve(); },
          (_, error) => { reject(error); }
        );
      });
    });
  });
};

const fetchDataFromDbAsync = async () => {
  return new Promise((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM menu;',
        [],
        (_, result) => { resolve(result.rows._array); },
        (_, error) => { reject(error); }
      );
    });
  });
};

const getFilteredMenuItems = async (activeCategories) => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM menu';
    if (activeCategories.length > 0) {
      const placeholders = activeCategories.map(() => '?').join(', ');
      query += ` WHERE category IN (${placeholders})`;
    }
    
    database.transaction(tx => {
      tx.executeSql(
        query,
        activeCategories,
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export { setupDatabaseAsync, storeDataInDbAsync, fetchDataFromDbAsync, getFilteredMenuItems };
