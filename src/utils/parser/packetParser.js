import { config } from '../../config/config.js';
import { ErrorCodes } from '../../constants/codes/errorCodes.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import CustomError from '../error/customError.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  const CommonPacket = protoMessages.common.CommonPacket;
  let packet;
  try {
    packet = CommonPacket.decode(data);
  } catch (e) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
  }

  const { handlerId, userId, version: clientVersion } = packet;

  if (clientVersion !== config.client.version) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전이 일치하지 않습니다.',
    );
  }

  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `알 수 없는 handlerID: ${handlerId}`);
  }

  const [namespace, typeName] = protoTypeName.split('.');
  const PayloadType = protoMessages[namespace][typeName];
  let payload;

  try {
    payload = PayloadType.decode(packet.payload); // 해당 페이로드 패킷구조 프로토파일 정보를 가져와 디코딩하기
  } catch (e) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생하였습니다.');
  }

  // 필드(속성)이 비어있는 경우 = 필수로 들어있어야할 필드가 누락된 경우 체크
  const expectedFields = Object.keys(PayloadType.fields); // 해당 프로토 파일의 필드 정보를 가져옵니다.
  const actualFields = Object.keys(payload); // 정의한 payload의 필드 정보를 가져옵니다.
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field)); // 전체 필드에서 가져온 필드에 안맞는(놓친) 필드가 있는지 확인합니다.
  // 놓친 필드가 있다면 오류처리합니다.
  if (missingFields.length > 0) {
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,
      `필수 필드가 누락되었습니다. ${missingFields.join(', ')}`,
    );
  }

  return { handlerId, userId, payload };
};
