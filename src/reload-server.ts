import { watch } from 'fs';
import { WebSocket } from 'ws';

const wss = new WebSocket.Server({ port: 3001 });

watch('./public', { recursive: true }, (event, filename) => {
  console.log(`Detected ${event} in ${filename}`);
  for (const client of wss.clients) {
    client.send('reload');
  }
});
