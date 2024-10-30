import { config } from '../../config/config.js';
import { PACKET_TYPE, PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProtos.js';

export const createResponse = (handlerId, responseCode, data = null) => {
  const protoMessages = getProtoMessages();

  const Response = protoMessages.response.Response;

  // response 프로토파일로 정의한 구조에 맞게 작성합니다.
  const response = {
    handlerId,
    responseCode,
    timestamp: Date.now(),
    data: data ? Buffer.from(JSON.stringify(data)) : null,
  };

  const buffer = Response.encode(response).finish();

  // 패킷 길이 정보 (4바이트)
  const packetLength = Buffer.alloc(TOTAL_LENGTH);
  packetLength.writeUint32BE(
    buffer.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  // 패킷 타입 정보 (1바이트)
  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUint8(PACKET_TYPE.NORMAL, 0);

  return Buffer.concat([packetLength, packetType, buffer]);
};
