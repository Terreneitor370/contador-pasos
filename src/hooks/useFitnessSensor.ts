import { useEffect, useRef, useState } from 'react';
import { Accelerometer } from 'expo-sensors';

export type MovementState = 'walking' | 'running' | 'idle';

export interface FitnessSensorConfig {
  updateIntervalMs?: number;
  peakThreshold?: number;
  peakDropThreshold?: number;
  minStepIntervalMs?: number;
  runningIntervalMs?: number;
  walkingStrideM?: number;
  runningStrideM?: number;
}

export interface FitnessSensorState {
  steps: number;
  distanceMeters: number;
  activity: MovementState;
  isActive: boolean;
  isAvailable: boolean | null;
  cadenceSpm: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

const DEFAULT_CONFIG: Required<FitnessSensorConfig> = {
  updateIntervalMs: 60,
  peakThreshold: 0.4,
  peakDropThreshold: 0.15,
  minStepIntervalMs: 220,
  runningIntervalMs: 460,
  walkingStrideM: 0.75,
  runningStrideM: 1.15,
};

const BASELINE_BLEED = 0.08;
const CADENCE_WINDOW = 8;

export function useFitnessSensor(config: FitnessSensorConfig = {}): FitnessSensorState {
  const settings: Required<FitnessSensorConfig> = { ...DEFAULT_CONFIG, ...config };

  const [steps, setSteps] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [activity, setActivity] = useState<MovementState>('idle');
  const [isActive, setIsActive] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [cadenceSpm, setCadenceSpm] = useState(0);

  const baselineRef = useRef(0);
  const isPeakRef = useRef(false);
  const lastStepAtRef = useRef(0);
  const intervalsRef = useRef<number[]>([]);
  const stepCountRef = useRef(0);
  const distanceRef = useRef(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    Accelerometer.isAvailableAsync()
      .then((available) => {
        if (mounted) setIsAvailable(available);
      })
      .catch(() => {
        if (mounted) setIsAvailable(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const {
      updateIntervalMs,
      peakThreshold,
      peakDropThreshold,
      minStepIntervalMs,
      runningIntervalMs,
      walkingStrideM,
      runningStrideM,
    } = settings;

    const handleStep = (now: number) => {
      const last = lastStepAtRef.current;
      lastStepAtRef.current = now;
      stepCountRef.current += 1;
      setSteps(stepCountRef.current);

      if (last > 0) {
        const interval = now - last;
        const window = intervalsRef.current;
        window.push(interval);
        if (window.length > CADENCE_WINDOW) window.shift();
        const avgInterval = window.reduce((sum, value) => sum + value, 0) / window.length;
        setCadenceSpm(Math.round(60000 / avgInterval));
        const nextActivity: MovementState =
          avgInterval < runningIntervalMs ? 'running' : 'walking';
        setActivity(nextActivity);
        const stride = nextActivity === 'running' ? runningStrideM : walkingStrideM;
        distanceRef.current += stride;
        setDistanceMeters(distanceRef.current);
      } else {
        setActivity('walking');
        distanceRef.current += walkingStrideM;
        setDistanceMeters(distanceRef.current);
      }
    };

    const listener = (sample: { x: number; y: number; z: number }) => {
      const magnitude = Math.sqrt(sample.x ** 2 + sample.y ** 2 + sample.z ** 2);
      if (!initializedRef.current) {
        baselineRef.current = magnitude;
        initializedRef.current = true;
        return;
      }
      const baseline = baselineRef.current;
      const filtered = baseline + BASELINE_BLEED * (magnitude - baseline);
      baselineRef.current = filtered;
      const signal = magnitude - filtered;
      const now = Date.now();

      if (isPeakRef.current) {
        if (signal <= peakDropThreshold) isPeakRef.current = false;
        return;
      }
      if (signal >= peakThreshold && now - lastStepAtRef.current >= minStepIntervalMs) {
        isPeakRef.current = true;
        handleStep(now);
      }
    };

    Accelerometer.setUpdateInterval(updateIntervalMs);
    const subscription = Accelerometer.addListener(listener);
    return () => subscription.remove();
  }, [isActive]);

  return {
    steps,
    distanceMeters,
    activity,
    isActive,
    isAvailable,
    cadenceSpm,
    start: () => setIsActive(true),
    stop: () => {
      setIsActive(false);
      setActivity('idle');
      setCadenceSpm(0);
    },
    reset: () => {
      stepCountRef.current = 0;
      distanceRef.current = 0;
      intervalsRef.current = [];
      lastStepAtRef.current = 0;
      isPeakRef.current = false;
      initializedRef.current = false;
      baselineRef.current = 0;
      setSteps(0);
      setDistanceMeters(0);
      setActivity('idle');
      setCadenceSpm(0);
    },
  };
}