import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PRIORITIES } from '../utils/constants';
import { COLORS } from '../styles/globalStyles';

export default function TaskCard({ task, onDelete, onEdit }) {
  const priority = PRIORITIES[task.priority] ?? PRIORITIES.Media;

  const confirmDelete = () => {
    Alert.alert('Eliminar tarea', '¿Seguro que deseas eliminar esta tarea?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => onDelete(task.id),
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onEdit(task)}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.title}>{task.title}</Text>
          {!!task.description && <Text style={styles.description}>{task.description}</Text>}
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{task.date || 'Sin fecha'}</Text>
        <Text style={styles.metaText}>{task.time || 'Sin hora'}</Text>
      </View>

      <View style={styles.badgeRow}>
        <Text
          style={[
            styles.badge,
            {
              backgroundColor: priority.backgroundColor,
              color: priority.color,
            },
          ]}
        >
          {priority.icon} {priority.label}
        </Text>
        <Text style={[styles.badge, styles.statusBadge]}>{task.status || 'No iniciada'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
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
  statusBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
});
