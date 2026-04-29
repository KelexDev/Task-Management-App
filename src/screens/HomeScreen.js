  
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTasks } from '../services/storage';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const storedTasks = await getTasks();
    setTasks(storedTasks);
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda Personal</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.buttonText}>Agregar Nueva Tarea</Text>
      </TouchableOpacity>

      {tasks.length === 0 ? (
        <Text style={styles.empty}>No hay tareas todavía.</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text style={styles.taskTitle}>{item.title}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 12, marginBottom: 20 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  empty: { marginTop: 20, color: '#666' },
  taskCard: { padding: 14, backgroundColor: '#f3f4f6', borderRadius: 12, marginBottom: 12 },
  taskTitle: { fontSize: 16, fontWeight: '600' },
});