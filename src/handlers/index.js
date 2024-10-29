import { ErrorCodes } from '../constants/codes/errorCodes.js';
import { HANDLER_IDS } from '../constants/handlerId.js';
import CustomError from '../utils/error/customError.js';
import { initialHandler } from './user/initial.handler.js';

// 클라이언트에게 받은 핸들러 id를 매핑해주는 역할을 하는 객체
const handlers = {
  [HANDLER_IDS.INITIAL]: {
    handler: initialHandler,
    protoType: 'initial.InitialPayload',
  },
};

/**
 * 핸들러 ID를 통해 해당 핸들러 함수를 찾는 함수
 * @param {*} handlerId
 * @returns
 */
export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
    );
  }
  return handlers[handlerId].handler;
};

/**
 * 핸들러 ID를 통해 프로토 타입의 이름을 조회하는 함수
 * @param {uint} handlerId
 * @returns
 */
export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `프로토타입을 찾을 수 없습니다. hadlerId : ${handlerId}`,
    );
  }
  return handlers[handlerId].protoType;
};
