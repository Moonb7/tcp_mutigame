import camelCase from 'lodash/camelCase.js';

export const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    // 배열인 경우, 배열의 각 요소에 대해 재귀적으로 toCamelCase 함수를 호출
    return obj.map((v) => toCamelCase(v));
  }
  // 객체인 경우, 객체의 키를 카멜케이스로 변환하고, 값에 대해서도 재귀적으로 toCamelCase 함수를 호출, key 값들 또한 배열, 객체일 수도 있기에 재귀를 합니다.
  else if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[camelCase(key)] = toCamelCase(obj[key]);
      return result;
    }, {}); // 초기값 빈 객체로 시작
  }
  // 객체도 배열도 아닌 경우, 원본 값을 반환
  return obj;
};
