import { getGameSession } from '../session/game.session.js';
import { removeUser } from '../session/user.session.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트와의 연결이 종료되었습니다.');

  await removeUser(socket);

  const gameSession = getGameSession();
  gameSession.removeUser(socket);
};
