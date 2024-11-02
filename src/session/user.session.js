import { ErrorCodes } from '../constants/codes/errorCodes.js';
import { updateLocation } from '../db/user/user.db.js';
import CustomError from '../utils/error/customError.js';
import { userSessions } from './session.js';

// 레디스로 해줘도 될것 같다

/**
 * 유저를 서버메모리에 추가 저장합니다.
 * @param {*} socket
 * @param {*} uuid
 * @returns
 */
export const addUser = (user) => {
  userSessions.push(user);
  return user;
};

/**
 * 서버 메모리에 있던 유저를 삭제합니다.
 * @param {*} socket
 * @returns
 */
export const removeUser = async (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    const user = userSessions[index];
    await updateLocation(user.id, user.x, user.y); // db에 위치값을 저장합니다.
    return userSessions.splice(index, 1)[0];
  }
};

/**
 * 현재 세션에 포함된 user정보를 배열로 반환해 줍니다.
 * @returns
 */
export const getAllUser = () => {
  return userSessions;
};

/**
 * socket을 통해 현재 세션에 포함된 유저를 조회합니다.
 * @param {*} socket
 * @returns
 */
export const getUserBySocket = (socket) => {
  const user = userSessions.find((user) => user.socket === socket);

  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
  }

  return user;
};
