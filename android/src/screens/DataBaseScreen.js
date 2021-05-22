import React, { useEffect, useState } from 'react';
import { Button, TextInput } from '../components/ui';
import ThemedPage from '../components/ui/ThemedPage';
import * as SQLite from 'expo-sqlite';
import { Text } from 'react-native-elements';
const db = SQLite.openDatabase('db.testDb')

export default ({ navigation }) => {

  const [items, setItems] = useState(null);
  const [text, setText] = useState("");

  let readData = async () => {

    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, price INT)'
      )
    });

      db.transaction(tx => {
        tx.executeSql('SELECT * FROM items', null, 
          (txObj, { rows: { _array } }) => setItems(_array),
          (txObj, error) => console.log('Error ', error)
          ) 
      }); 
    
  };

  let addData = () => {
      db.transaction(tx => {
        tx.executeSql('INSERT INTO items (text, price) values (?, ?)', [text, 185],
          (txObj, resultSet) => setItems(current => {
            return [
              ...current,
              {
                text,
                price: 185
              }
            ]
          }),
          (txObj, error) => console.log('Error', error))
      })
  }

  useEffect(() => {
    readData();
  }, []);

  return (
    <ThemedPage title={"BDD"} onUserPress={() => navigation.openDrawer()} loader={items == null}>
        {
          (items == null || items?.length == 0) ?
          <Text>Aucun items</Text>
          :
          items.map(function (item, key) {
            return <Text key={key}>{item.text} | {item.price} €</Text>
          })
        }
      <TextInput value={text} onChangeText={setText}/>
      <Button title="Ajouter un item" onPress={() => addData()} />
    </ThemedPage>
  );
};
