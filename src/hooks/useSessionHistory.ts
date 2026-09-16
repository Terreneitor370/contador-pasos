import { useCallback, useEffect, useState } from 'react';
import { loadSessions, saveSessions } from '../storage/history';
import type { SessionSummary, StepSession } from '../types';

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useSessionHistory() {
  const [sessions, setSessions] = useState<StepSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadSessions().then((stored) => {
      if (mounted) {
        setSessions(stored);
        setIsLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const addSession = useCallback((summary: SessionSummary) => {
    const session: StepSession = { id: makeId(), endedAt: Date.now(), ...summary };
    setSessions((current) => {
      const updated = [session, ...current];
      saveSessions(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSessions([]);
    saveSessions([]);
  }, []);

  return { sessions, isLoaded, addSession, clearHistory };
}
