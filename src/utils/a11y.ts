export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB | null {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4))
  };
}

export function parseColor(color: string): RGB | null {
    if (!color) return null;

    // Check if hex
    if (color.startsWith('#') || /^[0-9a-f]{3,6}$/i.test(color)) {
        return hexToRgb(color);
    }

    // Check if HSL (space separated numbers with optional %)
    // Matches "230 10% 10%" or "230 10 10"
    const hslMatch = color.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%?\s+(\d+(?:\.\d+)?)%?$/);
    if (hslMatch) {
        return hslToRgb(parseFloat(hslMatch[1]), parseFloat(hslMatch[2]), parseFloat(hslMatch[3]));
    }

    return null;
}

export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(c1: string, c2: string): number {
  const rgb1 = parseColor(c1);
  const rgb2 = parseColor(c2);

  if (!rgb1 || !rgb2) {
      console.warn(`Invalid colors: ${c1}, ${c2}`);
      return 0;
  }

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export interface WCAGResult {
  contrast: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
}

export function checkContrast(foreground: string, background: string): WCAGResult {
  const contrast = getContrastRatio(foreground, background);
  return {
    contrast: parseFloat(contrast.toFixed(2)),
    aa: contrast >= 4.5,
    aaa: contrast >= 7,
    aaLarge: contrast >= 3,
    aaaLarge: contrast >= 4.5
  };
}
