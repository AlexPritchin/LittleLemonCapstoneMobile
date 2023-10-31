import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS menu (id integer PRIMARY KEY NOT NULL, name text, price text, description text, image text, category text);'
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM menu;', [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  let queryStr = 'INSERT INTO menu (name, price, description, image, category) VALUES ';
  const queryStrValuesPlaceholders = menuItems.map((item) => '(?,?,?,?,?)').join(', ');
  queryStr += queryStrValuesPlaceholders + ';';
  const paramsArr = menuItems.flatMap((item) => [...Object.values(item)]);
  db.transaction((tx) => {
    tx.executeSql(queryStr, paramsArr);
  });
}
