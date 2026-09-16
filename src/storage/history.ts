import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StepSession } from '../types';

const STORAGE_KEY = '@contador-pasos/history';
const MAX_SESSIONS = 200;

export async function loadSessions(): Promise<StepSession[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveSessions(sessions: StepSession[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
}
