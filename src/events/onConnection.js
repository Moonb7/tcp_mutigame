import { onData } from './onData.js';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';

export const onConnection = (socket) => {
  socket.on('data', onData(socket));
  socket.on('data', onEnd(socket));
  socket.on('data', onError(socket));
};
