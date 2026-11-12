'use strict';
// Vercel function for the Thornhill darts league site when it is served from
// this repository's root project, under /thornhill/ (see ../vercel.json).
module.exports = require('../thornhill_darts/src/vercel').createVercelHandler({ basePath: '/thornhill' });
