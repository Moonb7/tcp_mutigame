import User from '../classes/models/user.class.js';
import { userSessions } from './session.js';

// 레디스로 해줘도 될것 같다

/**
 * 추가로 연결한 유저를 서버메모리에 추가 저장합니다.
 * @param {*} socket
 * @param {*} uuid
 * @returns
 */
export const addUser = (socket, id, playerId, latency) => {
  const user = new User(socket, id, playerId, latency);
  userSessions.push(user);
  return user;
};

/**
 * 서버 메모리에 있던 유저를 삭제합니다.
 * @param {*} socket
 * @returns
 */
export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
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

export const getAllUsers = () => {
  return userSessions;
};
