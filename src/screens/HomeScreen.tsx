import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { MovementState } from '../hooks/useFitnessSensor';
import { useFitnessSensor } from '../hooks/useFitnessSensor';

const COLORS = {
  paper: '#F6F3EC',
  ink: '#211F1D',
  subink: '#655E55',
  hairline: '#E3DDCF',
  card: '#FFFFFF',
  forest: '#2C6B4A',
  ember: '#B85C1B',
  stone: '#8C867E',
  rust: '#9E3B24',
};

const FONTS = {
  display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
};

function statusStyle(activity: MovementState, isActive: boolean) {
  if (!isActive) return { label: 'Detenido', color: COLORS.stone };
  if (activity === 'running') return { label: 'Corriendo', color: COLORS.ember };
  return { label: 'Caminando', color: COLORS.forest };
}

export default function HomeScreen() {
  const { steps, distanceMeters, activity, isActive, isAvailable, cadenceSpm, start, stop, reset } =
    useFitnessSensor();

  const status = statusStyle(activity, isActive);
  const distanceText =
    distanceMeters >= 1000
      ? `${(distanceMeters / 1000).toFixed(2)} km`
      : `${Math.round(distanceMeters)} m`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>Sesión actual</Text>
          <Text style={styles.header}>Contador de Pasos</Text>
        </View>

        <View style={[styles.ring, { borderColor: status.color }]}>
          <Text style={styles.stepsValue}>{steps}</Text>
          <Text style={styles.stepsLabel}>pasos</Text>
        </View>

        <View style={[styles.statusCard, { borderColor: status.color }]}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Distancia</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.cardValue}>
              {distanceText}
            </Text>
            <Text style={styles.cardSub}>recorrida</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Ritmo</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.cardValue}>
              {cadenceSpm > 0 ? cadenceSpm : '—'}
            </Text>
            <Text style={styles.cardSub}>pasos / min</Text>
          </View>
        </View>

        {isAvailable === false && (
          <Text style={styles.warning}>El acelerómetro no está disponible en este dispositivo.</Text>
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
              style={({ pressed }) => [
                styles.button,
                styles.startButton,
                pressed && styles.pressed,
              ]}
              onPress={start}
            >
              <Text style={styles.startButtonText}>Iniciar</Text>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reiniciar contador"
            style={({ pressed }) => [styles.button, styles.resetButton, pressed && styles.pressed]}
            onPress={reset}
          >
            <Text style={styles.resetButtonText}>Reiniciar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.paper,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.paper,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.subink,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  header: {
    fontFamily: FONTS.display,
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.ink,
  },
  ring: {
    width: 208,
    height: 208,
    borderRadius: 104,
    borderWidth: 14,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  stepsValue: {
    fontFamily: FONTS.mono,
    fontSize: 66,
    fontWeight: '700',
    color: COLORS.ink,
    fontVariant: ['tabular-nums'],
  },
  stepsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.subink,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginTop: 28,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusLabel: {
    fontSize: 18,
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
    padding: 20,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.subink,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  cardValue: {
    fontFamily: FONTS.mono,
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.ink,
    fontVariant: ['tabular-nums'],
  },
  cardSub: {
    fontSize: 13,
    color: COLORS.subink,
    marginTop: 4,
  },
  warning: {
    marginTop: 16,
    color: COLORS.rust,
    fontSize: 14,
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 'auto',
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
    backgroundColor: COLORS.forest,
  },
  startButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stopButton: {
    backgroundColor: COLORS.rust,
  },
  stopButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
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
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.75,
  },
});
