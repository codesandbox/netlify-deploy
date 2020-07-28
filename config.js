const { join } = require('path');
const chokidar = require('chokidar');
const { readFileSync } = require('fs');

let config;

const configPath = join(__dirname, 'config', 'config.json');

function loadConfig() {
  config = JSON.parse(readFileSync(configPath, { encoding: 'utf8' }));
}

chokidar
  .watch(configPath, {
    awaitWriteFinish: true,
    ignoreInitial: true,
    usePolling: true,
  })
  .on('change', path => {
    console.log(`${path} changed, reloading...`);
    loadConfig();
  })
  .on('all', (event, path) => {
    console.log(`${event}: ${path}`);
  });

loadConfig();

module.exports = config;
