import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';
import { packetNames } from '../protobuf/packetNames.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const protoDir = path.join(__dirname, '../protobuf'); // 해당 프로토버퍼 파일 경로

const getAllProtoFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    // filePath에서 해당 경로를 찾았더니 파일이 아닌 폴더형태이다 하면 또 다시 한번더 함수를 실행시켜 파일을 찾아 읽게합니다. 재귀적으로
    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
    } else if (path.extname(file) === '.proto') {
      // file의 확장자가 proto파일이면 해당 파일 경로를 추가합니다.
      fileList.push(filePath);
    }
  });
  return fileList;
};

// 프로토 버프 파일들의 경로만을 가지는 변수입니다.
const protoFiles = getAllProtoFiles(protoDir);

const protoMessages = {};

export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    // 모든 프로토 파일들을 읽어서 root 프로토 버퍼.Root 객체에 로드합니다.
    await Promise.all(protoFiles.map((file) => root.load(file)));

    for (const [packetName, types] of Object.entries(packetNames)) {
      protoMessages[packetName] = {};
      for (const [typeName, type] of Object.entries(types)) {
        protoMessages[packetName][type] = root.lookupType(typeName); // root여기서 로드된 파일에서 해당 typeName 즉 프로토파일에서 정의한 message의 이름, 타입들을 순회하여 알맞게 객체에 저장합니다.
      }
    }
    console.log('Protobuf 파일이 로드되었습니다.');
  } catch (e) {
    console.error('Protobuf 파일 로드 중 오류가 발생했습니다.', e);
  }
};

// 원본 객체에 영향을 주지 않기 위해 얕은 복사를 통해 정보를 넘겨줍니다. // object freeze
export const getProtoMessages = () => {
  return { ...protoMessages };
};
