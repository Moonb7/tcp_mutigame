import Game from '../classes/models/game.class.js';
import { gameSessions } from './session.js';

/**
 * 새로운 게임 세션 추가하는 함수입니다.
 * @param {*} id 게임 세션 id
 */
export const addGameSession = (id) => {
  const session = new Game(id);
  gameSessions.push(session);

  return session;
};

/**
 * 해당 게임 세션을 삭제하는 함수입니다.
 * @param {*} id 게임 세션 id
 * @returns
 */
// export const removeGameSession = (id) => {
//   const index = gameSessions.findIndex((game) => game.id === id);
//   if (index !== -1) {
//     return gameSessions.splice(index, 1)[0];
//   }
// };
export const removeGameSession = () => {
  return delete gameSessions[0];
};

/**
 * 해당 게임 세션을 조회하는 함수입니다.
 * @param {*} id 게임 세션 id
 * @returns
 */
// export const getGameSession = (id) => {
//   const session = gameSessions.find((game) => game.id === id);
//   return session;
// };
export const getGameSession = () => {
  return gameSessions[0];
};

/**
 * 현재 존재하는 모든 게임 세션을 조회하는 함수입니다.
 * @returns
 */
export const getAllGameSessions = () => {
  return gameSessions;
};
