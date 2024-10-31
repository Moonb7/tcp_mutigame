export const USERDB_SQL = {
  USER_QUERIES: {
    FIND_USER_BY_DEVICE_ID: 'SELECT * FROM user WHERE device_id = ?',
    CREATE_USER: 'INSERT INTO user (device_id) VALUES (?)', // 클라에서 유저의 ID를 생성해서 넘겨주면 그걸 저장하면 될것 같다
    UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE device_id = ?',
  },
  GAME_END_QUERIES: {
    FIND_GAME_INFO_BY_USER_ID: 'SELECT * FROM game_end WHERE user_id = ?',
    CREATE_GAME_END_INFO:
      'INSERT INTO game_end (user_id, end_locationX, end_locationY) VALUES (?, ?, ?)',
    UPATE_LOCATION: 'UPDATE game_end SET end_locationX = ?, end_locationY = ? WHERE user_id = ?',
  },
};
