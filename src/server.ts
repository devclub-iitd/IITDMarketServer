import http from 'http';
import app from './app';

const server = http.createServer(app);

server.listen(app.get('port'), () => {
  console.log(`App is Running at http://localhost:${app.get('port')}`);
  console.log('  Press CTRL-C to stop\n');
});

export default server;
