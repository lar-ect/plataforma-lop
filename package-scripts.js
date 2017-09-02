const path = require('path');
const { 
  concurrent,
  series,
  runInNewWindow,
  commonTags,
  ifWindows
} = require('nps-utils');

const { oneLine } = commonTags;

const hiddenFromHelp = true;

const ignoreOutput = s =>
`echo ${s} && ${s} ${ifWindows('> NUL', '&>/dev/null')}`;

module.exports = {
  scripts: {
    default: {
      description: 'Inicia o mongo, o servidor Node e o webpack em modo de desenvolvimento',
      script: concurrent.nps('mongo.silent', 'server', 'assets'),
      // separate: {
      //   hiddenFromHelp,
      //   description: 'Roda todos os scripts de desenvolvimento em terminais individuais',
      //   script: series(
      //     runInNewWindow.nps('mongo --silent')
      //   )
      // }
    },
    mongo: {
      description: oneLine`
        Cria o diretório .mongo-db e inicia o processo do mongo.
        Esse comando ignora o output. Se você deseja ver o log de saída,
        execute: "npm start mongo.start".
      `,
      script: series('mkdirp .mongo-db', 'nps mongo.start'),
      silent: {
        description: 'Inicia o servidor do mongodb e ignora o output',
        script: ignoreOutput('nps mongo')
      },
      start: {
        description: oneLine`
          Inicia o servidor do mongodb com o banco 
          no diretório ./mongo-db
        `,
        script: `mongod --dbpath "${path.join(__dirname, './.mongo-db')}"`
      },
      stop: {
        description: 'Para o servidor do mongo',
        script: 'mongo admin --eval "db.shutdownServer()"'
      }
    },
    watch: 'nodemon ./app.js --ignore public/ --ignore cypress/',
    dev: 'concurrently "npm run watch" "npm run assets" --names "💻,📦" --prefix name',
    assets: 'webpack -w --display-max-modules 0',
    commit: 'git-cz',
    test: {
      default: 'jest --coverage',
      watch: 'jest --watch'
    },
    generateWebpackStats: 'webpack --profile --json > webpack-stats.json',
    analyzeBundle: 'npx webpack-bundle-analyzer webpack-stats.json public/dist'
  }
};
