import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/globalStyles';

export default function EntryState() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✓</Text>
      <Text style={styles.title}>No hay tareas todavía</Text>
      <Text style={styles.text}>Agrega una tarea para comenzar tu agenda.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    color: COLORS.success,
    fontSize: 42,
    fontWeight: '700',
    marginBottom: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  text: {
    color: COLORS.secondary,
    textAlign: 'center',
  },
});
