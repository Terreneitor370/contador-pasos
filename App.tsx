import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import BottomTabBar from './src/components/BottomTabBar';
import type { TabKey } from './src/components/BottomTabBar';
import { useSessionHistory } from './src/hooks/useSessionHistory';
import { COLORS } from './src/theme';

export default function App() {
  const [tab, setTab] = useState<TabKey>('inicio');
  const { sessions, addSession, clearHistory } = useSessionHistory();

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ flex: 1 }}>
          {tab === 'inicio' ? (
            <HomeScreen onSessionSaved={addSession} />
          ) : (
            <HistoryScreen sessions={sessions} onClear={clearHistory} />
          )}
        </View>
        <BottomTabBar active={tab} onChange={setTab} />
      </View>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
