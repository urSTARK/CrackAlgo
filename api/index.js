// Vercel serverless entry — imports Express app from project root
const server = require('../server');
// If server is an Express app, export it directly (Vercel will treat it as a handler).
// Otherwise, if it's a function, export that.
module.exports = server;
