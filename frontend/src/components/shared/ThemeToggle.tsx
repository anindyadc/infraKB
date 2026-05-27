import { Sun, Moon, Monitor } from 'lucide-react';
import { useUIStore, Theme } from '../../store/ui.store';

export default function ThemeToggle() {
  const { theme, setTheme } = useUIStore();

  const themes: { name: Theme; icon: any }[] = [
    { name: 'light', icon: Sun },
    { name: 'dark', icon: Moon },
    { name: 'system', icon: Monitor },
  ];

  const cycleTheme = () => {
    const currentIndex = themes.findIndex((t) => t.name === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].name);
  };

  const currentTheme = themes.find((t) => t.name === theme) || themes[2];
  const Icon = currentTheme.icon;

  return (
    <button
      onClick={cycleTheme}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
