// 패킷의 해더 부분에 관련된 contants를 관리하는 파일

export const TOTAL_LENGTH = 4;
export const PACKET_TYPE_LENGTH = 1;

export const PAKET_TYPE = {
  PING: 0,
  Normal: 1,
  Location: 3,
};
