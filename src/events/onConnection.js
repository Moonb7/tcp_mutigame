import { onData } from './onData.js';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';

export const onConnection = (socket) => {
  console.log(`Client connected from: ${socket.remoteAddress}:${socket.remotePort}`);

  // 각 클라이언트마다 고유한 버퍼를 유지시키기 빈 버퍼만들기
  socket.buffer = Buffer.alloc(0); // 전송받을 데이터를 위해 아무 크기없는 버퍼 미리 만들기

  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
