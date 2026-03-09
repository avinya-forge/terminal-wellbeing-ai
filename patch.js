const fs = require('fs');
let code = fs.readFileSync('src/services/__tests__/MemoryService.test.ts', 'utf8');
code = code.replace(/import \* as embeddingsMock from '..\/..\/utils\/embeddings';/g, "const embeddingsMock = require('../../utils/embeddings');");
// to disable the eslint rule for this specific block:
code = code.replace(/const embeddingsMock = require\('..\/..\/utils\/embeddings'\);/g, "// eslint-disable-next-line @typescript-eslint/no-require-imports\n      const embeddingsMock = require('../../utils/embeddings');");
fs.writeFileSync('src/services/__tests__/MemoryService.test.ts', code);
