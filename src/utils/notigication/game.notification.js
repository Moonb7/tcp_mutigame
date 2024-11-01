import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProtos.js';

const makeNotification = (message, type) => {
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    message.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeInt8(type, 0);

  return Buffer.concat([packetLength, packetType, message]);
};

export const createLocationPacket = (users) => {
  const protoMessages = getProtoMessages();
  const LocationUpdate = protoMessages.gameNotification.LocationUpdate;

  const payload = { users }; // 클라에서 받은 users를 할당
  const message = LocationUpdate.create(payload);
  const locationPacket = LocationUpdate.encode(message).finish();
  return makeNotification(locationPacket, PACKET_TYPE.LOCATION);
};
