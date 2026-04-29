import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { saveTasks, getTasks } from '../services/storage';

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');

  const handleSave = async () => {
    if (!title.trim()) return;

    const currentTasks = await getTasks();
    const newTask = {
      id: Date.now(),
      title: title.trim(),
    };

    await saveTasks([...currentTasks, newTask]);
    setTitle('');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Tarea</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribe tu tarea"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#d1d5db', padding: 14, borderRadius: 12, marginBottom: 16 },
  button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});