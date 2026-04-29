import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { deleteTask, getTasks } from '../services/storage';
import { COLORS } from '../constants/colors';

const FILTERS = ['Todas', 'No iniciada', 'En proceso', 'Finalizada'];

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>✓</Text>
      <Text style={styles.emptyTitle}>No hay tareas todavía</Text>
      <Text style={styles.emptyText}>Agrega una tarea para comenzar tu agenda.</Text>
    </View>
  );
}

function TaskCard({ task, onPress, onDelete }) {
  return (
    <TouchableOpacity style={styles.taskCard} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.taskHeader}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          {!!task.description && <Text style={styles.taskDescription}>{task.description}</Text>}
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{task.date || 'Sin fecha'}</Text>
        <Text style={styles.metaText}>{task.time || 'Sin hora'}</Text>
      </View>

      <View style={styles.badgeRow}>
        <Text style={[styles.badge, styles.priorityBadge]}>{task.priority || 'Media'}</Text>
        <Text style={[styles.badge, styles.statusBadge]}>{task.status || 'No iniciada'}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
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

  const handleDelete = (taskId) => {
    Alert.alert('Eliminar tarea', '¿Seguro que deseas eliminar esta tarea?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(taskId);
          loadTasks();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda Personal</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddEditTask')}
      >
        <Text style={styles.buttonText}>Agregar Nueva Tarea</Text>
      </TouchableOpacity>

      <View style={styles.filters}>
        {FILTERS.map((filter) => (
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
        ListEmptyComponent={EmptyState}
        contentContainerStyle={filteredTasks.length === 0 ? styles.emptyList : styles.list}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('AddEditTask', { task: item })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    padding: 20,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 16,
    padding: 14,
  },
  buttonText: {
    color: COLORS.surface,
    fontWeight: '700',
    textAlign: 'center',
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
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    color: COLORS.success,
    fontSize: 42,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyText: {
    color: COLORS.secondary,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  taskHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  taskDescription: {
    color: COLORS.secondary,
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  metaText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  badge: {
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priorityBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
});
