import { addGameSession } from '../session/game.session.js';
import { loadProtos } from './loadProtos.js';
import { v4 as uuidv4 } from 'uuid';

export const initServer = async () => {
  try {
    await loadProtos();
    const gameId = uuidv4(); // 클라자체에서 gameId를 생성해서 패킷이랑 같이 보내주어야 작동하게끔 설계를 해야 되는 것 같다 일단 임시로 하자
    const gameSession = addGameSession(gameId); // 임시로 게임 세션을 하나 추가합니다.
  } catch (e) {
    console.error(e);
    console.log('에셋 데이터를 가져오는 과정에서 문제가 발생하였습니다.');
    process.exit(1);
  }
};
