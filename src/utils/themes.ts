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
