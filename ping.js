var http = require('http'); //importing http
var log4js = require('log4js');
log4js.configure({
    appenders: { ubuntu: { type: 'file', filename: 'ping.log' } },
    categories: { default: { appenders: ['ubuntu'], level: 'info' } }
  });
var logger = log4js.getLogger('ubuntu');
var axios = require('axios');

function forceGC() {
   if (global.gc) {
      global.gc();
   } else {
      logger.warn('No GC hook! Start your program as `node --expose-gc file.js`.');
   }
}

function startKeepAlive() {
    setInterval(async () => {
	forceGC();
        let res;
        try {
            res = await axios.get('https://warm-garden-52058.herokuapp.com/api/posts');
            if (res.status === 200) {
                logger.info(`/api/posts has ${res.data.length} entries`);
            } else {
                logger.error('/api/posts failure')
            }
        } catch(err) {
            logger.error(err);
        }
    }, 20 * 60 * 1000); // load every 20 minutes
    //}, 15000); // load every 20 minutes
}

startKeepAlive();
