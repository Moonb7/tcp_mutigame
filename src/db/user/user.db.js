import { ErrorCodes } from '../../constants/codes/errorCodes.js';
import CustomError from '../../utils/error/customError.js';
import { toCamelCase } from '../../utils/response/transformCase.js';
import pools from '../database.js';
import { USERDB_SQL } from './user.querise.js';

/**
 * db에서 deviceId를 통해 user레코드를 찾습니다.
 * @param {*} deviceId
 * @returns
 */
export const findUserByDeviceId = async (deviceId) => {
  try {
    const [rows] = await pools.USER_DB.query(USERDB_SQL.USER_QUERIES.FIND_USER_BY_DEVICE_ID, [
      deviceId,
    ]);
    return toCamelCase(rows[0]); // 카멜케이스로 변환하여 반환
  } catch (e) {
    throw new CustomError(ErrorCodes.SQL_ERROR, `DB 유저 조회 중 문제가 발생하였습니다. ${e}`);
  }
};

/**
 * user_db에 deviceId를 통해 user레코드와 game_end레코드를 생성합니다.
 * @param {*} deviceId
 * @returns
 */
export const createUser = async (deviceId) => {
  const connection = await pools.USER_DB.getConnection();

  try {
    // 트랜젝션 격리 수준 설정
    await connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    await connection.beginTransaction(); // 트랜잭션 시작

    // user 레코드 생성
    await connection.query(USERDB_SQL.USER_QUERIES.CREATE_USER, [deviceId]);

    // const user = await findUserByDeviceId(deviceId);
    const [rows] = await connection.query(USERDB_SQL.USER_QUERIES.FIND_USER_BY_DEVICE_ID, [
      deviceId,
    ]);
    const user = toCamelCase(rows[0]); // 카멜케이스로 변환하여 반환

    // game_end 레코드 생성 (x, y) 좌표는 (0, 0) 으로 초기화
    await connection.query(USERDB_SQL.GAME_END_QUERIES.CREATE_GAME_END_INFO, [user.id, 0, 0]);

    await connection.commit();

    return user;
  } catch (e) {
    await connection.rollback();

    throw new CustomError(
      ErrorCodes.SQL_ERROR,
      `DB 새로운 유저를 생성하는 과정에서 문제가 발생하였습니다. ${e}`,
    );
  } finally {
    connection.release(); // 연결 해제
  }
};

/**
 * 유저의 최근 로그인 정보를 업데이트합니다.
 * @param {*} deviceId
 */
export const updateUserLogin = async (deviceId) => {
  try {
    await pools.USER_DB.query(USERDB_SQL.USER_QUERIES.UPDATE_USER_LOGIN, [deviceId]); // db 처리
  } catch (e) {
    throw new CustomError(
      ErrorCodes.SQL_ERROR,
      `DB 유저의 로그인 정보를 업데이트 하는 과정에서 문제가 발생하였습니다. ${e}`,
    );
  }
};

/**
 * 해당 유저의 db에 있는 game_end 레코드에서 x y 값을 업데이트 해줍니다.
 * @param {*} deviceId
 * @param {*} x
 * @param {*} y
 */
export const updateLocation = async (deviceId, x, y) => {
  const connection = await pools.USER_DB.getConnection();

  try {
    // 트랜젝션 격리 수준 설정
    await connection.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    await connection.beginTransaction(); // 트랜잭션 시작

    const user = await findUserByDeviceId(deviceId);

    await pools.USER_DB.query(USERDB_SQL.GAME_END_QUERIES.UPATE_LOCATION, [x, y, user.id]); // db 처리

    await connection.commit();
  } catch (e) {
    await connection.rollback();

    throw new CustomError(
      ErrorCodes.SQL_ERROR,
      `DB 유저의 위치값을 업데이트 하는데 문제가 발생하였습니다. ${e}`,
    );
  } finally {
    connection.release(); // 연결 해제
  }
};

/**
 * 해당 유저의 game_end 레코드 정보를 받환해 줍니다. (x, y)등 위치정보가 포함되어있습니다.
 * @param {*} userId
 * @returns
 */
export const findGameEndInfo = async (userId) => {
  try {
    const [rows] = await pools.USER_DB.query(
      USERDB_SQL.GAME_END_QUERIES.FIND_GAME_INFO_BY_USER_ID,
      [userId],
    );

    return toCamelCase(rows[0]);
  } catch (e) {
    throw new CustomError(
      ErrorCodes.SQL_ERROR,
      `DB 유저의 이전 게임 정보를 조회하는 과정에서 문제가 발생하였습니다. ${e}`,
    );
  }
};
