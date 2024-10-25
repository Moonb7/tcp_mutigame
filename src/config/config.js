import { CLIENT_VERSION, HOST, PORT } from '../constants/env.js';

// 구성별로 config변수를 이용해 모든 환경변수, 상수들을 관리하여 사용합니다.
export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {},
};
