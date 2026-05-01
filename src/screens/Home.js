import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import EntryState from '../components/EntryState';
import TaskCard from '../components/TaskCard';
import { deleteTask, getTasks } from '../storage/storage';
import { FILTER_OPTIONS } from '../utils/constants';
import { COLORS, globalStyles } from '../styles/globalStyles';

export default function Home({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Todas');

  const loadTasks = async () => {
    const storedTasks = await getTasks();
    setTasks(storedTasks);
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const filteredTasks =
    selectedFilter === 'Todas'
      ? tasks
      : tasks.filter((task) => (task.status || 'No iniciada') === selectedFilter);

  const handleDelete = async (taskId) => {
    const wasDeleted = await deleteTask(taskId);

    if (wasDeleted) {
      loadTasks();
      return;
    }

    Alert.alert('Error', 'No se pudo eliminar la tarea.');
  };

  return (
    <View style={[globalStyles.screen, globalStyles.screenPadding]}>
      <Text style={[globalStyles.title, styles.title]}>Agenda Personal</Text>

      <TouchableOpacity
        style={[globalStyles.primaryButton, styles.addButton]}
        onPress={() => navigation.navigate('AddEditTask')}
      >
        <Text style={globalStyles.buttonText}>Agregar Nueva Tarea</Text>
      </TouchableOpacity>

      <View style={styles.filters}>
        {FILTER_OPTIONS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, selectedFilter === filter && styles.activeFilterButton]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={EntryState}
        contentContainerStyle={filteredTasks.length === 0 ? styles.emptyList : styles.list}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onDelete={handleDelete}
            onEdit={(task) => navigation.navigate('AddEditTask', { task })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
  },
  addButton: {
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
  activeFilterText: {
    color: COLORS.surface,
  },
  list: {
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
});
