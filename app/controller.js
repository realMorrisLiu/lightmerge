/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const Router = require('koa-router');
const Log = require('./utils/logger');

const prefix = '/api';
const router = Router({ prefix });

function addMapping(mapping) {
  Object.keys(mapping).forEach((url) => {
    if (url.startsWith('GET ')) {
      const path = url.substring(4);
      router.get(path, mapping[url]);
      Log.debug(`GET ${prefix}${path}`);
    } else if (url.startsWith('POST ')) {
      const path = url.substring(5);
      router.post(path, mapping[url]);
      Log.debug(`POST ${prefix}${path}`);
    } else if (url.startsWith('PUT ')) {
      const path = url.substring(4);
      router.put(path, mapping[url]);
      Log.debug(`PUT ${prefix}${path}`);
    } else if (url.startsWith('DELETE ')) {
      const path = url.substring(7);
      router.del(path, mapping[url]);
      Log.debug(`DELETE ${prefix}${path}`);
    } else {
      Log.debug(`invalid URL: ${url}`);
    }
  });
}

function addControllers(dir) {
  fs.readdirSync(`${__dirname}/${dir}`)
    .filter(f => f.endsWith('.js'))
    .forEach((f) => {
      Log.debug(`In file ${f}:`);
      // eslint-disable-next-line global-require
      const mapping = require(`${__dirname}/${dir}/${f}`);
      addMapping(mapping);
    });
}

module.exports = (dir) => {
  const controllersDir = dir || 'controllers';
  addControllers(controllersDir);
  return router.routes();
};
