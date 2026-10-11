#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const guidelinesPath = path.join(__dirname, '../src/data/clinical_guidelines.json');

let guidelines;
try {
    const data = fs.readFileSync(guidelinesPath, 'utf8');
    guidelines = JSON.parse(data);
} catch (err) {
    console.error('Failed to read or parse clinical_guidelines.json:', err);
    process.exit(1);
}

let hasError = false;

const tiers = ['tier1_immediate_emergency', 'tier2_unsafe_territory', 'tier3_high_sensitivity'];

tiers.forEach(tier => {
    const tierData = guidelines.safety_tiers[tier];
    if (tierData && tierData.keywords) {
        const keywords = tierData.keywords;
        const seen = new Set();

        keywords.forEach(kw => {
            if (kw !== kw.toLowerCase()) {
                console.error(`Error: Keyword "${kw}" in ${tier} contains uppercase letters.`);
                hasError = true;
            }
            if (seen.has(kw)) {
                console.error(`Error: Keyword "${kw}" in ${tier} is duplicated.`);
                hasError = true;
            }
            seen.add(kw);
        });
    }
});

if (hasError) {
    console.error('Validation failed. All keywords must be lowercase and unique within a tier.');
    process.exit(1);
} else {
    console.log('Validation passed. All keywords are lowercase and unique.');
}
