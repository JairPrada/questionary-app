import { useEffect, useState } from 'react';
import {
  InterviewSettings,
  buildSession,
  loadSettings,
  persistSettings,
} from './lib/interview';
import { Theme, applyThemeClass, loadTheme, saveTheme } from './lib/theme';
import { HomeScreen } from './components/HomeScreen';
import { ConfigScreen } from './components/ConfigScreen';
import { InterviewScreen } from './components/InterviewScreen';
import { SummaryScreen } from './components/SummaryScreen';

type Screen = 'home' | 'config' | 'interview' | 'summary';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [settings, setSettings] = useState<InterviewSettings>(() => loadSettings());
  const [session, setSession] = useState<string[]>([]);
  const [usedTimes, setUsedTimes] = useState<number[]>([]);
  const [theme, setTheme] = useState<Theme>(() => loadTheme());

  useEffect(() => {
    applyThemeClass(theme);
    saveTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleChange = (next: InterviewSettings) => {
    setSettings(next);
    persistSettings(next);
  };

  const handleStart = () => {
    const questions = buildSession(settings);
    if (questions.length === 0) return;
    setSession(questions);
    setUsedTimes([]);
    setScreen('interview');
  };

  const handleFinish = (times: number[]) => {
    setUsedTimes(times);
    setScreen('summary');
  };

  const handleRestart = () => {
    const questions = buildSession(settings);
    if (questions.length === 0) return;
    setSession(questions);
    setUsedTimes([]);
    setScreen('interview');
  };

  return (
    <>
      {screen === 'home' && (
        <HomeScreen
          settings={settings}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onQuickStart={handleStart}
          onNewSession={() => setScreen('config')}
        />
      )}
      {screen === 'config' && (
        <ConfigScreen
          settings={settings}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onChange={handleChange}
          onStart={handleStart}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'interview' && (
        <InterviewScreen
          questions={session}
          secondsPerQuestion={settings.secondsPerQuestion}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onFinish={handleFinish}
          onExit={() => setScreen('home')}
        />
      )}
      {screen === 'summary' && (
        <SummaryScreen
          questions={session}
          usedTimes={usedTimes}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onRestart={handleRestart}
          onConfig={() => setScreen('config')}
          onHome={() => setScreen('home')}
        />
      )}
    </>
  );
}

export default App;
