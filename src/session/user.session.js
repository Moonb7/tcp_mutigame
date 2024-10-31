import { updateLocation } from '../db/user/user.db.js';
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
 * UUID를 통해 해당 유저를 조회하는 함수입니다.
 * @param {*} id 유저의 id
 * @returns
 */
export const getUserById = (id) => {
  const user = userSessions.find((user) => user.id === id);
  return user;
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
