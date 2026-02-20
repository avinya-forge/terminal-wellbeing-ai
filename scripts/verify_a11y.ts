import { THEMES } from '../src/utils/themes';
import { checkContrast } from '../src/utils/a11y';

console.log('Running Accessibility Verification on Themes...');
console.log('---------------------------------------------');

let errors = 0;

Object.values(THEMES).forEach(theme => {
  console.log(`Checking theme: ${theme.displayName} (${theme.name})`);

  const bg = theme.colors.background;
  const fg = theme.colors.foreground;

  const result = checkContrast(fg, bg);

  if (result.aa) {
    console.log(`  ✅ Contrast (FG/BG): ${result.contrast} (Passes AA)`);
  } else {
    console.error(`  ❌ Contrast (FG/BG): ${result.contrast} (Fails AA)`);
    errors++;
  }

  // Check Primary / Primary Foreground
  const pBg = theme.colors.primary;
  const pFg = theme.colors.primaryForeground;
  const pResult = checkContrast(pFg, pBg);

  if (pResult.aaLarge) {
     console.log(`  ✅ Contrast (Primary): ${pResult.contrast} (Passes AA Large/AA)`);
  } else {
     console.warn(`  ⚠️ Contrast (Primary): ${pResult.contrast} (Low contrast for text on primary)`);
  }

  console.log('');
});

if (errors > 0) {
  console.error(`Found ${errors} accessibility violations.`);
  process.exit(1);
} else {
  console.log('All themes passed basic accessibility checks!');
}
