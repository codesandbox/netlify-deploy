const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const rawSecrets = {};

const secretsPath = join(__dirname, 'secrets');

const files = readdirSync(secretsPath);

for (const file of files) {
  if (!file.startsWith('.')) {
    rawSecrets[file] = readFileSync(join(secretsPath, file), {
      encoding: 'utf8',
    });
  }
}

module.exports = rawSecrets;
