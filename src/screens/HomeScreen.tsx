import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StepRing from '../components/StepRing';
import { COLORS } from '../theme';
import { formatDistance } from '../utils/format';
import type { MovementState } from '../hooks/useFitnessSensor';
import { useFitnessSensor } from '../hooks/useFitnessSensor';
import type { SessionSummary } from '../types';

const DAILY_GOAL_STEPS = 10000;

interface HomeScreenProps {
  onSessionSaved: (summary: SessionSummary) => void;
}

function statusStyle(activity: MovementState, isActive: boolean) {
  if (!isActive) return { label: 'Detenido', color: COLORS.stone };
  if (activity === 'running') return { label: 'Corriendo', color: COLORS.red };
  return { label: 'Caminando', color: COLORS.green };
}

const todayLabel = new Date().toLocaleDateString('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export default function HomeScreen({ onSessionSaved }: HomeScreenProps) {
  const { steps, distanceMeters, activity, isActive, isAvailable, cadenceSpm, start, stop, reset } =
    useFitnessSensor({ onSessionSaved });

  const status = statusStyle(activity, isActive);
  const progress = steps / DAILY_GOAL_STEPS;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <Text style={styles.date}>{todayLabel}</Text>
          <Text style={styles.header}>Contador de Pasos</Text>
        </View>

        <StepRing
          size={224}
          strokeWidth={16}
          progress={progress}
          color={status.color}
          trackColor={COLORS.hairline}
        >
          <MaterialCommunityIcons name="shoe-print" size={22} color={status.color} />
          <Text style={styles.stepsValue}>{steps}</Text>
          <Text style={styles.stepsLabel}>de {DAILY_GOAL_STEPS.toLocaleString('es-MX')} pasos</Text>
        </StepRing>

        <View style={[styles.statusPill, { backgroundColor: `${status.color}1A` }]}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <MaterialCommunityIcons name="map-marker-distance" size={20} color={COLORS.green} />
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.cardValue}>
              {formatDistance(distanceMeters)}
            </Text>
            <Text style={styles.cardLabel}>Distancia</Text>
          </View>
          <View style={styles.card}>
            <MaterialCommunityIcons name="speedometer" size={20} color={COLORS.red} />
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.cardValue}>
              {cadenceSpm > 0 ? cadenceSpm : '—'}
            </Text>
            <Text style={styles.cardLabel}>Pasos / min</Text>
          </View>
        </View>

        {isAvailable === false && (
          <Text style={styles.warning}>El acelerómetro no está disponible en este dispositivo.</Text>
        )}

        <View style={styles.bottomGroup}>
          {steps > 0 && (
            <Text style={styles.hint}>Reiniciar guarda esta sesión en tu historial.</Text>
          )}
          <View style={styles.buttonsRow}>
            {isActive ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Detener conteo de pasos"
                style={({ pressed }) => [styles.button, styles.stopButton, pressed && styles.pressed]}
                onPress={stop}
              >
                <Text style={styles.stopButtonText}>Detener</Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Iniciar conteo de pasos"
                style={({ pressed }) => [styles.button, styles.startButton, pressed && styles.pressed]}
                onPress={start}
              >
                <Text style={styles.startButtonText}>Iniciar</Text>
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Guardar y reiniciar contador"
              style={({ pressed }) => [styles.button, styles.resetButton, pressed && styles.pressed]}
              onPress={reset}
            >
              <Text style={styles.resetButtonText}>Reiniciar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  date: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.ink,
  },
  stepsValue: {
    fontSize: 52,
    fontWeight: '800',
    color: COLORS.ink,
    marginTop: 6,
    fontVariant: ['tabular-nums'],
  },
  stepsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.subtext,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 20,
    marginBottom: 18,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 18,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.ink,
    marginTop: 8,
    fontVariant: ['tabular-nums'],
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.subtext,
    marginTop: 2,
  },
  warning: {
    marginTop: 16,
    color: COLORS.stop,
    fontSize: 14,
    textAlign: 'center',
  },
  bottomGroup: {
    width: '100%',
    marginTop: 'auto',
  },
  hint: {
    fontSize: 12,
    color: COLORS.subtext,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: COLORS.green,
  },
  startButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '700',
  },
  stopButton: {
    backgroundColor: COLORS.stop,
  },
  stopButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  resetButtonText: {
    color: COLORS.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
