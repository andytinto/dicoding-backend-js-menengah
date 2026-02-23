import server from './server/index.js';

const host = process.env.HOST !== 'production' ? 'localhost' : '0.0.0.0';
const port = process.env.PORT || 5000;
server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
