import { loadProtos } from './loadProtos.js';

export const initServer = async () => {
  try {
    await loadProtos();
  } catch (e) {
    console.error(e);
    console.log('에셋 데이터를 가져오는 과정에서 문제가 발생하였습니다.');
  }
};
