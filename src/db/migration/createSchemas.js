import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pools from '../database.js';

const __filename = fileURLToPath(import.meta.url); // 현재 모듈의 파일 경로를 문자열로 저장합니다.
const __dirname = path.dirname(__filename); // 현재 파일의 디렉토리(폴더) 경로를 가져옵니다.

const executeSqlFile = async (pool, filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  const quereis = sql
    .split(';')
    .map((query) => query.trim()) // 공백 제거
    .filter((query) => query.length > 0); // 해당 값이 있으면

  for (const query of quereis) {
    await pool.query(query);
  }
};

const userDbCreateSchemas = async () => {
  const sqlDir = path.join(__dirname, '../sql'); // 현재 파일의 상위 폴더에 있는 sql 폴더의 경로를 찾습니다.
  try {
    await executeSqlFile(pools.USER_DB, path.join(sqlDir, 'user_db.sql')); // user_db.sql 파일을 찾아 실행합니다.
  } catch (e) {
    console.error(`데이터베이스 테이블 생성 중 오류가 발생했습니다. ${e}`);
  }
};

// 현재 파일을 한번 실행하여 마이그레이션을 완료합니다.
userDbCreateSchemas()
  .then(() => {
    console.log('마이그레이션이 완료되었습니다.');
    process.exit(0);
  })
  .catch((e) => {
    console.error('마이그레이션에 실패하였습니다.', e);
    process.exit(1);
  });
