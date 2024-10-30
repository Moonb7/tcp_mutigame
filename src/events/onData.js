import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getHandlerById } from '../handlers/index.js';
import { packetParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);
  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength; // 총 헤더 길이

  while (socket.buffer.length > totalHeaderLength) {
    const length = socket.buffer.readUInt32BE(0); // 데이터에 포함된 총 길이를 가져옵니다. 데이터의 첫번째 부터 4바이트까지 읽어옵니다. 쉽게 표현하면 1 ~ 4까지 읽습니다.
    const packetType = socket.buffer.readUInt8(config.packet.totalLength); // 이것도 마찬가지로 패킷의 타입을 가져옵니다. 4바이트부터 1바이트까지 읽습니다. 쉽게 표현하면 시작위치: TOTAL_LENGTH = 4, 그래서 4 ~ 5, 5에 자리만 읽습니다.

    if (socket.buffer.length >= length) {
      const packet = socket.buffer.subarray(totalHeaderLength, length); // 실제 보내줄 정보 payload부분입니다.
      socket.buffer = socket.buffer.subarray(length); // 다음 패킷에 대비해 필요이상의 데이터를 제거하여 buffer에 데이터를 초기화 시킵니다.
      try {
        switch (packetType) {
          case PACKET_TYPE.PING: {
            break;
          }

          case PACKET_TYPE.NORMAL: {
            const { handlerId, userId, payload } = packetParser(packet);
            const handler = getHandlerById(handlerId);

            handler({ socket, userId, payload });
            // console.log('result:', result);
            break;
          }

          case PACKET_TYPE.LOCATION: {
            break;
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      break;
    }
  }
};
