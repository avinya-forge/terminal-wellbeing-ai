export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface Theme {
  name: string;
  displayName: string;
  colors: ThemeColors;
}

export const THEMES: Record<string, Theme> = {
  modern: {
    name: 'modern',
    displayName: 'Modern Dark',
    colors: {
      background: '230 10% 10%',
      foreground: '120 20% 95%',
      card: '230 10% 12%',
      cardForeground: '120 20% 95%',
      popover: '230 10% 12%',
      popoverForeground: '120 20% 95%',
      primary: '120 40% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '230 20% 20%',
      secondaryForeground: '120 20% 90%',
      muted: '230 10% 20%',
      mutedForeground: '120 10% 70%',
      accent: '120 50% 40%',
      accentForeground: '0 0% 100%',
      destructive: '0 60% 50%',
      destructiveForeground: '0 0% 100%',
      border: '230 10% 20%',
      input: '230 10% 20%',
      ring: '120 40% 50%',
    },
  },
  retro: {
    name: 'retro',
    displayName: 'Retro Amber',
    colors: {
      background: '20 10% 5%', // Very dark brown/black
      foreground: '35 90% 60%', // Amber
      card: '20 10% 7%',
      cardForeground: '35 90% 60%',
      popover: '20 10% 7%',
      popoverForeground: '35 90% 60%',
      primary: '35 90% 60%', // Amber
      primaryForeground: '20 10% 5%',
      secondary: '20 20% 15%',
      secondaryForeground: '35 80% 50%',
      muted: '20 10% 15%',
      mutedForeground: '35 60% 40%',
      accent: '35 100% 50%',
      accentForeground: '20 10% 5%',
      destructive: '0 60% 50%',
      destructiveForeground: '0 0% 100%',
      border: '35 90% 30%', // Dim amber
      input: '20 20% 15%',
      ring: '35 90% 60%',
    },
  },
  matrix: {
    name: 'matrix',
    displayName: 'The Matrix',
    colors: {
      background: '120 100% 2%', // Almost black green
      foreground: '120 100% 50%', // Bright green
      card: '120 100% 3%',
      cardForeground: '120 100% 50%',
      popover: '120 100% 3%',
      popoverForeground: '120 100% 50%',
      primary: '120 100% 50%',
      primaryForeground: '0 0% 0%',
      secondary: '120 30% 10%',
      secondaryForeground: '120 80% 40%',
      muted: '120 30% 10%',
      mutedForeground: '120 50% 30%',
      accent: '120 100% 40%',
      accentForeground: '0 0% 0%',
      destructive: '0 60% 50%',
      destructiveForeground: '0 0% 100%',
      border: '120 100% 20%',
      input: '120 30% 10%',
      ring: '120 100% 50%',
    },
  },
  cyberpunk: {
    name: 'cyberpunk',
    displayName: 'Cyberpunk',
    colors: {
      background: '260 50% 10%', // Deep purple
      foreground: '180 100% 50%', // Cyan
      card: '260 50% 12%',
      cardForeground: '180 100% 50%',
      popover: '260 50% 12%',
      popoverForeground: '180 100% 50%',
      primary: '320 100% 60%', // Pink
      primaryForeground: '0 0% 100%',
      secondary: '260 40% 20%',
      secondaryForeground: '180 90% 40%',
      muted: '260 30% 20%',
      mutedForeground: '260 40% 60%',
      accent: '60 100% 60%', // Yellow
      accentForeground: '260 50% 10%',
      destructive: '0 100% 60%',
      destructiveForeground: '0 0% 100%',
      border: '320 100% 40%',
      input: '260 40% 20%',
      ring: '320 100% 60%',
    },
  },
  ocean: {
    name: 'ocean',
    displayName: 'Deep Ocean',
    colors: {
      background: '220 60% 10%', // Dark blue
      foreground: '190 80% 90%', // Light blue/white
      card: '220 60% 12%',
      cardForeground: '190 80% 90%',
      popover: '220 60% 12%',
      popoverForeground: '190 80% 90%',
      primary: '190 90% 50%', // Cyan/Teal
      primaryForeground: '220 60% 10%',
      secondary: '220 40% 20%',
      secondaryForeground: '190 70% 80%',
      muted: '220 30% 20%',
      mutedForeground: '220 40% 60%',
      accent: '200 80% 40%',
      accentForeground: '0 0% 100%',
      destructive: '0 60% 60%',
      destructiveForeground: '0 0% 100%',
      border: '190 50% 30%',
      input: '220 40% 20%',
      ring: '190 90% 50%',
    },
  },
  light: {
    name: 'light',
    displayName: 'Light Mode',
    colors: {
      background: '0 0% 100%',
      foreground: '240 10% 4%',
      card: '0 0% 100%',
      cardForeground: '240 10% 4%',
      popover: '0 0% 100%',
      popoverForeground: '240 10% 4%',
      primary: '240 6% 10%',
      primaryForeground: '0 0% 98%',
      secondary: '240 5% 96%',
      secondaryForeground: '240 6% 10%',
      muted: '240 5% 96%',
      mutedForeground: '240 4% 46%',
      accent: '240 5% 96%',
      accentForeground: '240 6% 10%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 98%',
      border: '240 6% 90%',
      input: '240 6% 90%',
      ring: '240 5% 65%',
    },
  },
  dracula: {
    name: 'dracula',
    displayName: 'Dracula',
    colors: {
      background: '231 15% 18%', // #282a36
      foreground: '60 30% 96%', // #f8f8f2
      card: '231 15% 25%',
      cardForeground: '60 30% 96%',
      popover: '231 15% 25%',
      popoverForeground: '60 30% 96%',
      primary: '326 100% 74%', // Pink #ff79c6
      primaryForeground: '231 15% 18%',
      secondary: '265 89% 78%', // Purple #bd93f9
      secondaryForeground: '231 15% 18%',
      muted: '231 15% 28%',
      mutedForeground: '231 15% 60%',
      accent: '135 94% 65%', // Green #50fa7b
      accentForeground: '231 15% 18%',
      destructive: '0 100% 67%', // Red #ff5555
      destructiveForeground: '0 0% 100%',
      border: '231 15% 38%',
      input: '231 15% 28%',
      ring: '326 100% 74%',
    }
  },
  nord: {
    name: 'nord',
    displayName: 'Nord',
    colors: {
      background: '220 16% 22%', // #2e3440
      foreground: '218 27% 92%', // #d8dee9
      card: '220 16% 26%',
      cardForeground: '218 27% 92%',
      popover: '220 16% 26%',
      popoverForeground: '218 27% 92%',
      primary: '193 43% 67%', // #88c0d0
      primaryForeground: '220 16% 22%',
      secondary: '213 32% 52%', // #5e81ac
      secondaryForeground: '218 27% 92%',
      muted: '220 16% 30%',
      mutedForeground: '220 16% 60%',
      accent: '179 25% 65%', // #8fbcbb
      accentForeground: '220 16% 22%',
      destructive: '354 42% 56%', // #bf616a
      destructiveForeground: '218 27% 92%',
      border: '220 16% 36%',
      input: '220 16% 30%',
      ring: '193 43% 67%',
    }
  },
  monokai: {
    name: 'monokai',
    displayName: 'Monokai',
    colors: {
      background: '70 8% 15%', // #272822
      foreground: '0 0% 97%', // #f8f8f2
      card: '70 8% 20%',
      cardForeground: '0 0% 97%',
      popover: '70 8% 20%',
      popoverForeground: '0 0% 97%',
      primary: '70 60% 50%', // Green #a6e22e
      primaryForeground: '70 8% 15%',
      secondary: '54 70% 68%', // Yellow #e6db74
      secondaryForeground: '70 8% 15%',
      muted: '70 8% 25%',
      mutedForeground: '70 8% 60%',
      accent: '326 100% 60%', // Pink #f92672
      accentForeground: '0 0% 97%',
      destructive: '0 100% 60%',
      destructiveForeground: '0 0% 97%',
      border: '70 8% 30%',
      input: '70 8% 25%',
      ring: '70 60% 50%',
    }
  },
  solarized: {
    name: 'solarized',
    displayName: 'Solarized Dark',
    colors: {
      background: '192 100% 11%', // #002b36
      foreground: '192 15% 60%', // #839496
      card: '192 100% 15%',
      cardForeground: '192 15% 60%',
      popover: '192 100% 15%',
      popoverForeground: '192 15% 60%',
      primary: '169 77% 38%', // #2aa198
      primaryForeground: '0 0% 100%',
      secondary: '205 69% 49%', // #268bd2
      secondaryForeground: '0 0% 100%',
      muted: '192 100% 18%',
      mutedForeground: '192 10% 40%',
      accent: '169 77% 38%',
      accentForeground: '0 0% 100%',
      destructive: '359 71% 52%', // #dc322f
      destructiveForeground: '0 0% 100%',
      border: '192 100% 20%',
      input: '192 100% 18%',
      ring: '169 77% 38%',
    }
  }
};

export function getTheme(themeName: string): Theme {
  return THEMES[themeName] || THEMES['modern'];
}

export function applyTheme(themeName: string): void {
  const theme = getTheme(themeName);
  const root = document.documentElement;

  // Helper to set CSS variable
  const setVar = (name: string, value: string) => {
    root.style.setProperty(`--${name}`, value);
  };

  const { colors } = theme;

  setVar('background', colors.background);
  setVar('foreground', colors.foreground);
  setVar('card', colors.card);
  setVar('card-foreground', colors.cardForeground);
  setVar('popover', colors.popover);
  setVar('popover-foreground', colors.popoverForeground);
  setVar('primary', colors.primary);
  setVar('primary-foreground', colors.primaryForeground);
  setVar('secondary', colors.secondary);
  setVar('secondary-foreground', colors.secondaryForeground);
  setVar('muted', colors.muted);
  setVar('muted-foreground', colors.mutedForeground);
  setVar('accent', colors.accent);
  setVar('accent-foreground', colors.accentForeground);
  setVar('destructive', colors.destructive);
  setVar('destructive-foreground', colors.destructiveForeground);
  setVar('border', colors.border);
  setVar('input', colors.input);
  setVar('ring', colors.ring);

  // Also update sidebar variables (if used) to match
  setVar('sidebar-background', colors.card);
  setVar('sidebar-foreground', colors.cardForeground);
  setVar('sidebar-primary', colors.primary);
  setVar('sidebar-primary-foreground', colors.primaryForeground);
  setVar('sidebar-accent', colors.accent);
  setVar('sidebar-accent-foreground', colors.accentForeground);
  setVar('sidebar-border', colors.border);
  setVar('sidebar-ring', colors.ring);
}

export function listThemes(): string {
  return Object.values(THEMES)
    .map(t => `${t.name}: ${t.displayName}`)
    .join('\n');
}
