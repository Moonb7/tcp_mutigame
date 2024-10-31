import User from '../../classes/models/user.class.js';
import { RESPONSE_SUCCESS_CODE } from '../../constants/codes/responseCode.js';
import { HANDLER_IDS } from '../../constants/handlerId.js';
import {
  createUser,
  findGameEndInfo,
  findUserByDeviceId,
  updateUserLogin,
} from '../../db/user/user.db.js';
import { getGameSession } from '../../session/game.session.js';
import { addUser } from '../../session/user.session.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, playerId, latency } = payload;

    let user = await findUserByDeviceId(deviceId);

    if (!user) {
      user = await createUser(deviceId);
    } else {
      await updateUserLogin(deviceId); // 로그인 시간 초기화
    }

    const gameEndInfo = await findGameEndInfo(user.id);

    user = new User(
      socket,
      deviceId,
      playerId,
      latency,
      gameEndInfo.endLocationX,
      gameEndInfo.endLocationY,
    );

    // 세션에 유저 추가
    addUser(user);

    const gameSession = getGameSession();
    // 게임 세션에 유저 추가
    gameSession.addUser(user);

    const initialResponse = createResponse(HANDLER_IDS.INITIAL, RESPONSE_SUCCESS_CODE, {
      userId: deviceId,
      x: user.x,
      y: user.y,
    });

    socket.write(initialResponse);
  } catch (e) {
    // 추가로 핸들러 에러처리해야됨 기억해
    handlerError(socket, e);
  }
};
