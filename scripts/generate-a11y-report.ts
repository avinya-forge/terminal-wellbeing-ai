import fs from 'fs';
import path from 'path';

const REPORT_PATH = path.join(process.cwd(), 'playwright-report', 'results.json');
const OUTPUT_PATH = path.join(process.cwd(), 'a11y-report.md');

interface PlaywrightReport {
  suites: Suite[];
  stats: {
    startTime: string;
    duration: number;
    expected: number;
    unexpected: number;
    flaky: number;
  };
}

interface Suite {
  title: string;
  file: string;
  specs: Spec[];
  suites?: Suite[];
}

interface Spec {
  title: string;
  ok: boolean;
  tests: Test[];
}

interface Test {
  status: 'passed' | 'failed' | 'timedOut' | 'skipped';
  results: TestResult[];
}

interface TestResult {
  status: 'passed' | 'failed' | 'timedOut' | 'skipped';
  error?: { message: string; stack: string };
  errors?: { message: string; stack: string }[];
}

function findA11yTests(suites: Suite[]): Spec[] {
  let specs: Spec[] = [];
  for (const suite of suites) {
    if (suite.file && suite.file.includes('a11y.spec.ts')) {
      specs = specs.concat(getAllSpecs(suite));
    } else if (suite.suites) {
      specs = specs.concat(findA11yTests(suite.suites));
    }
  }
  return specs;
}

function getAllSpecs(suite: Suite): Spec[] {
  let specs = [...suite.specs];
  if (suite.suites) {
    for (const childSuite of suite.suites) {
      specs = specs.concat(getAllSpecs(childSuite));
    }
  }
  return specs;
}

function generateReport() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error(`Report file not found at ${REPORT_PATH}. Run playwright tests first.`);
    process.exit(1);
  }

  const report: PlaywrightReport = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8'));
  const a11ySpecs = findA11yTests(report.suites);

  let md = `# Accessibility Audit Report\n\n`;
  md += `**Date:** ${new Date().toLocaleString()}\n`;
  md += `**Total Tests:** ${a11ySpecs.length}\n\n`;

  md += `| Test Case | Status | Details |\n`;
  md += `|-----------|--------|---------|\n`;

  let passed = 0;
  let failed = 0;

  for (const spec of a11ySpecs) {
    const lastResult = spec.tests[0].results[spec.tests[0].results.length - 1];
    const status = lastResult.status;
    const icon = status === 'passed' ? '✅' : '❌';

    if (status === 'passed') passed++;
    else failed++;

    let details = 'No violations found.';
    const error = lastResult.error || (lastResult.errors && lastResult.errors[0]);

    if (status === 'failed' && error) {
      // Try to extract useful info, but keep it brief for the table
      details = `Violations detected. [See Logs]`;
    }

    md += `| ${spec.title} | ${icon} ${status.toUpperCase()} | ${details} |\n`;
  }

  md += `\n## Summary\n`;
  md += `- **Passed:** ${passed}\n`;
  md += `- **Failed:** ${failed}\n`;
  md += `- **Success Rate:** ${((passed / a11ySpecs.length) * 100).toFixed(1)}%\n`;

  if (failed > 0) {
    md += `\n### Failure Details\n`;
    for (const spec of a11ySpecs) {
        const lastResult = spec.tests[0].results[spec.tests[0].results.length - 1];
        const error = lastResult.error || (lastResult.errors && lastResult.errors[0]);
        if (lastResult.status === 'failed' && error) {
            md += `#### ${spec.title}\n`;
            md += "```\n" + error.message + "\n```\n";
        }
    }
  }

  fs.writeFileSync(OUTPUT_PATH, md);
  console.log(`Report generated at ${OUTPUT_PATH}`);
}

generateReport();
