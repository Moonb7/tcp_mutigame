# 멀티플레이 게임서버

### 프로젝트 소개

tcp를 이용하여 멀티플레이 게임 서버를 구현하는 프로젝트입니다.

### 디렉토리 구조

```
tcp_mutigame
📦src
 ┣ 📂classes
 ┃ ┣ 📂managers
 ┃ ┃ ┗ 📜latency.manager.js
 ┃ ┗ 📂models
 ┃ ┃ ┣ 📜game.class.js
 ┃ ┃ ┗ 📜user.class.js
 ┣ 📂config
 ┃ ┗ 📜config.js
 ┣ 📂constants
 ┃ ┣ 📂codes
 ┃ ┃ ┣ 📜errorCodes.js
 ┃ ┃ ┗ 📜responseCode.js
 ┃ ┣ 📜env.js
 ┃ ┣ 📜handlerId.js
 ┃ ┗ 📜header.js
 ┣ 📂db
 ┃ ┣ 📂migration
 ┃ ┃ ┗ 📜createSchemas.js
 ┃ ┣ 📂sql
 ┃ ┃ ┗ 📜user_db.sql
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📜user.db.js
 ┃ ┃ ┗ 📜user.querise.js
 ┃ ┗ 📜database.js
 ┣ 📂events
 ┃ ┣ 📜onConnection.js
 ┃ ┣ 📜onData.js
 ┃ ┣ 📜onEnd.js
 ┃ ┗ 📜onError.js
 ┣ 📂handlers
 ┃ ┣ 📂game
 ┃ ┃ ┗ 📜locationUpdate.handler.js
 ┃ ┣ 📂user
 ┃ ┃ ┗ 📜initial.handler.js
 ┃ ┗ 📜index.js
 ┣ 📂init
 ┃ ┣ 📜index.js
 ┃ ┗ 📜loadProtos.js
 ┣ 📂protobuf
 ┃ ┣ 📂notification
 ┃ ┃ ┗ 📜game.notification.proto
 ┃ ┣ 📂request
 ┃ ┃ ┣ 📜common.proto
 ┃ ┃ ┣ 📜game.proto
 ┃ ┃ ┗ 📜initial.proto
 ┃ ┣ 📂response
 ┃ ┃ ┗ 📜response.proto
 ┃ ┗ 📜packetNames.js
 ┣ 📂session
 ┃ ┣ 📜game.session.js
 ┃ ┣ 📜session.js
 ┃ ┗ 📜user.session.js
 ┣ 📂utils
 ┃ ┣ 📂error
 ┃ ┃ ┣ 📜customError.js
 ┃ ┃ ┗ 📜errorHandler.js
 ┃ ┣ 📂notigication
 ┃ ┃ ┗ 📜game.notification.js
 ┃ ┣ 📂parser
 ┃ ┃ ┗ 📜packetParser.js
 ┃ ┣ 📂response
 ┃ ┃ ┣ 📜createResponse.js
 ┃ ┃ ┗ 📜transformCase.js
 ┃ ┗ 📜dateFomatter.js
 ┗ 📜server.js
```

### 패킷 구조

**바이트 구조**
| 필드 명 | 타입 | 설명 | 크기 |
| ----------- | -------- | -------------------- | ----- |
| totalLength | int | 메세지의 전체 길이 | 4Byte |
| packetType | int | 패킷의 타입 | 1Byte |
| protobuf | protobuf | 프로토콜 버퍼 구조체 | 가변 |

### 프로토 버프 구조

**common** <br>
| 필드 명 | 타입 | 설명 |
| ------------- | ------ | ------------------------ |
| handlerId | uint32 | 핸들러 ID (4바이트) |
| userId | string | 유저 ID (UUID) |
| version | string | 클라이언트 버전 (문자열) |
| payload | bytes | 실제 데이터 |

**LocationUpdatePayload** <br>
| 필드 명 | 타입 | 설명 |
| ------------- | ------ | ------------------------ |
| x | float | 유저의 x좌표 |
| y | float | 유저의 y좌표 |

**InitialPayload** <br>
| 필드 명 | 타입 | 설명 |
| ------------- | ------ | ------------------------ |
| deviceId | string | 유저 ID (UUID) |
| playerId | uint32 | 캐릭터 id |
| latency | float | 지연시간 |

**LocationUpdate** <br>
| 필드 명 | 타입 | 설명 |
| ------------- | ------ | ------------------------ |
| users | repeated UserLocation | 여러 유저 정보 |

**UserLocation** <br>
| 필드 명 | 타입 | 설명 |
| ------------- | ------ | ------------------------ |
| id | string | 유저 ID (UUID) |
| playerId | uint32 | 캐릭터 id |
| x | float | 유저의 x좌표 |
| y | float | 유저의 y좌표 |

**Response** <br>
| 필드 명 | 타입 | 설명 |
| ------------ | ------ | ---------------------------------------------- |
| handlerId | uint32 | 핸들러 ID |
| responseCode | uint32 | 응답 코드 (성공: 0, 실패: 에러 코드) |
| timestamp | int64 | 메시지 생성 타임스탬프 (Unix 타임스탬프) |
| data | bytes | 실제 응답 데이터 (선택적 필드) |
| sequence | uint32 | 시퀀스 값 (클라이언트의 요청 수를 저장합니다.) |

### 라이브러리

- dotenv: 환경변수 파일 .env 파일로부터 환경변수 정보를 읽고, 해당 환경변수를 사용할 수 있게 도와주는 라이브러리입니다.
  - 환경변수 값들은 process.env에 할당됩니다.
- lodash: 해당 변수나 이름을 여러형태의 케이스(카멜 케이스, 스네이크 케이스...등)으로 변환해 주는 라이브러리입니다.
- mysql2: mysql을 이용하여 커넥션 풀을 관리할 수 있고 sql문법도 사용할 수 있는 라이브러리입니다.
- protobufjs: 프로토 파일들을 직렬화와 역직렬화할 수 있게 해주는 라이브러리입니다.
- uuid: 고유한 uuid를 생성해 줄때 사용되는 라이브러리입니다. 현재 서버에서 테스트로 uuid를 생성하여 진행하였습니다. (실제 현재 프로젝트에선 클라이언트에서 생성후 uuid를 넘겨줍니다.)

**개발 라이브러리**

- prettier: 코드를 일관성 있게 설정한 값으로 자동으로 관리해 주어 코드의 가독성을 도와주는 라이브러리입니다.
- nodemon: 테스트 프로젝트를 실행 중 자동으로 코드가 수정된 것을 인식하여 프로젝트를 재실행하여 개발속도를 높혀주는 라이브러리입니다.
