import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import { formatDistance, formatDuration, formatSessionDate } from '../utils/format';
import type { StepSession } from '../types';

interface HistoryScreenProps {
  sessions: StepSession[];
  onClear: () => void;
}

export default function HistoryScreen({ sessions, onClear }: HistoryScreenProps) {
  const confirmClear = () => {
    Alert.alert(
      'Borrar historial',
      'Se eliminarán todas las sesiones guardadas. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar', style: 'destructive', onPress: onClear },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>
        {sessions.length > 0 && (
          <Pressable
            onPress={confirmClear}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Borrar historial"
          >
            <Text style={styles.clearText}>Borrar</Text>
          </Pressable>
        )}
      </View>

      {sessions.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="shoe-print" size={40} color={COLORS.hairline} />
          <Text style={styles.emptyTitle}>Sin actividad todavía</Text>
          <Text style={styles.emptyText}>
            Presiona Iniciar en la pantalla de Inicio y luego Reiniciar para guardar tu primera sesión aquí.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons name="shoe-print" size={22} color={COLORS.green} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardDate}>{formatSessionDate(item.endedAt)}</Text>
                <Text style={styles.cardSteps}>{item.steps.toLocaleString('es-MX')} pasos</Text>
              </View>
              <View style={styles.cardStats}>
                <Text style={styles.statText}>{formatDistance(item.distanceMeters)}</Text>
                <Text style={styles.statText}>{formatDuration(item.durationMs)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.ink,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.stop,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${COLORS.green}1A`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardBody: {
    flex: 1,
  },
  cardDate: {
    fontSize: 13,
    color: COLORS.subtext,
    marginBottom: 2,
  },
  cardSteps: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
  },
  cardStats: {
    alignItems: 'flex-end',
    gap: 2,
  },
  statText: {
    fontSize: 13,
    color: COLORS.subtext,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
});
