import { execSync } from 'child_process';
import fs from 'fs';

describe('manage.js cleanup()', () => {
  it('does not remove files in dry-run mode', () => {
     try {
       // Create a mock file so there's something to "remove" in dry run
       fs.writeFileSync('test.bak', 'test');
       const output = execSync('node scripts/manage.js cleanup --dry-run', { stdio: 'pipe' }).toString();
       expect(output).toContain('Running in DRY-RUN mode. No files will be modified.');
       expect(output).toContain('[DRY-RUN] Would remove:');
     } catch (e) {
       throw new Error('manage.js failed: ' + e.message);
     } finally {
       if (fs.existsSync('test.bak')) {
         fs.unlinkSync('test.bak');
       }
     }
  });
});
