import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('verify_keywords.js', () => {
  const testGuidelinesPath = path.resolve('src/data/clinical_guidelines.json');
  let originalGuidelinesContent = '';

  beforeAll(() => {
    originalGuidelinesContent = fs.readFileSync(testGuidelinesPath, 'utf8');
  });

  afterEach(() => {
    fs.writeFileSync(testGuidelinesPath, originalGuidelinesContent, 'utf8');
  });

  afterAll(() => {
     fs.writeFileSync(testGuidelinesPath, originalGuidelinesContent, 'utf8');
  });

  it('passes when guidelines are valid', () => {
    // Write valid guidelines
    fs.writeFileSync(testGuidelinesPath, JSON.stringify({
      safety_tiers: {
        tier1_immediate_emergency: { keywords: ['lower case'] },
        tier2_unsafe_territory: { keywords: ['another lower case'] },
        tier3_high_sensitivity: { keywords: ['one more'] }
      }
    }), 'utf8');

    try {
      execSync('node scripts/verify_keywords.js', { stdio: 'pipe' });
    } catch (e) {
      throw new Error('Expected script to pass but it failed: ' + e.message);
    }
  });

  it('fails when a keyword has uppercase letters', () => {
    fs.writeFileSync(testGuidelinesPath, JSON.stringify({
      safety_tiers: {
        tier1_immediate_emergency: { keywords: ['UPPER CASE'] }
      }
    }), 'utf8');

    try {
      execSync('node scripts/verify_keywords.js', { stdio: 'pipe' });
      throw new Error('Expected script to fail but it passed');
    } catch (e) {
      expect(e.status).toBe(1);
      expect(e.stderr.toString()).toContain('contains uppercase letters');
    }
  });

  it('fails when a keyword is duplicated', () => {
    fs.writeFileSync(testGuidelinesPath, JSON.stringify({
      safety_tiers: {
        tier1_immediate_emergency: { keywords: ['duplicate', 'duplicate'] }
      }
    }), 'utf8');

    try {
      execSync('node scripts/verify_keywords.js', { stdio: 'pipe' });
      throw new Error('Expected script to fail but it passed');
    } catch (e) {
      expect(e.status).toBe(1);
      expect(e.stderr.toString()).toContain('is duplicated');
    }
  });

  it('fails when json is invalid', () => {
     fs.writeFileSync(testGuidelinesPath, 'invalid json', 'utf8');

     try {
      execSync('node scripts/verify_keywords.js', { stdio: 'pipe' });
      throw new Error('Expected script to fail but it passed');
    } catch (e) {
      expect(e.status).toBe(1);
      expect(e.stderr.toString()).toContain('Failed to read or parse');
    }
  });
});
