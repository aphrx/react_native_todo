import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import Task from './components/Task';
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('dbs.db')


export default function App() {
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);

  

  useEffect(() => {
    createTable();
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM Tasks", [], (_, { rows: { _array } }) => setTaskItems(_array))});
    
  }, [])

  const handleAddTask = () => {
    Keyboard.dismiss();
    //setTaskItems([...taskItems, task]);
    db.transaction((tx) => {
      tx.executeSql("INSERT INTO Tasks (task) VALUES (?)", [task]);
      tx.executeSql("SELECT * FROM Tasks", [], (_, { rows: { _array } }) => setTaskItems(_array));
    })
    setTask(null);
  }

  const completeTask = (id) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM Tasks WHERE id = ?", [id]);
      tx.executeSql("SELECT * FROM Tasks", [], (_, { rows: { _array } }) => setTaskItems(_array));
    })
  }
  
  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT);")
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        <View style={styles.items}>
          {
            taskItems.map(({id, task}) => {
              return (
                <TouchableOpacity key={id} onPress={() => completeTask(id)}>
                  <Task text={task}/>
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)}/>
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30
  },
  writeTaskWrapper:{
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input:{
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderColor: '#c0c0c0',
    borderWidth: 0.5,
    width: 250

  },
  addWrapper:{
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#c0c0c0',
    borderWidth: 0.5,
  }
});
