import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { addTask, updateTask } from '../storage/storage';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../utils/constants';
import { COLORS, globalStyles } from '../styles/globalStyles';

export default function AddEditTask({ navigation }) {
  const route = useRoute();
  const existingTask = route.params?.task;
  const isEditing = Boolean(existingTask);

  const [title, setTitle] = useState(existingTask?.title ?? '');
  const [description, setDescription] = useState(existingTask?.description ?? '');
  const [date, setDate] = useState(existingTask?.date ?? '');
  const [time, setTime] = useState(existingTask?.time ?? '');
  const [priority, setPriority] = useState(existingTask?.priority ?? 'Media');
  const [status, setStatus] = useState(existingTask?.status ?? 'No iniciada');

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Tarea' : 'Nueva Tarea',
    });
  }, [isEditing, navigation]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validación', 'El campo Título es obligatorio.');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      date: date.trim(),
      time: time.trim(),
      priority,
      status,
    };

    const savedTask = isEditing
      ? await updateTask(existingTask.id, taskData)
      : await addTask(taskData);

    if (!savedTask) {
      Alert.alert('Error', 'No se pudo guardar la tarea.');
      return;
    }

    navigation.goBack();
  };

  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe el título"
        placeholderTextColor={COLORS.secondary}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        placeholder="Agrega una descripción"
        placeholderTextColor={COLORS.secondary}
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>Fecha</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={COLORS.secondary}
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Hora</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            placeholderTextColor={COLORS.secondary}
            value={time}
            onChangeText={setTime}
          />
        </View>
      </View>

      <Text style={styles.label}>Prioridad</Text>
      <View style={styles.options}>
        {PRIORITY_OPTIONS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.option, priority === item && styles.selectedOption]}
            onPress={() => setPriority(item)}
          >
            <Text style={[styles.optionText, priority === item && styles.selectedOptionText]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Estado</Text>
      <View style={styles.options}>
        {STATUS_OPTIONS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.option, status === item && styles.selectedOption]}
            onPress={() => setStatus(item)}
          >
            <Text style={[styles.optionText, status === item && styles.selectedOptionText]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={globalStyles.successButton} onPress={handleSave}>
        <Text style={globalStyles.buttonText}>
          {isEditing ? 'Actualizar tarea' : 'Guardar tarea'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 16,
    padding: 14,
  },
  textArea: {
    minHeight: 110,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    flex: 1,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  option: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
  selectedOptionText: {
    color: COLORS.surface,
  },
});
