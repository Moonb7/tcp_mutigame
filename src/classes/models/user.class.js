import { ErrorCodes } from '../../constants/codes/errorCodes.js';
import CustomError from '../../utils/error/customError.js';
import { createPingPacket } from '../../utils/notigication/game.notification.js';

class User {
  constructor(socket, id, playerId, latency, x, y) {
    this.socket = socket;
    this.id = id;
    this.playerId = playerId;
    this.latency = latency;
    this.x = x;
    this.y = y;
    this.lastX = 0;
    this.lastY = 0;
    this.lastUpdateTime = Date.now();
    this.speed = 3; // 이 스피드는 클라이언트의 코드와 비교해서 넣어주어야 한다
  }

  updatePosition(x, y) {
    this.lastX = this.x;
    this.lastY = this.y;
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  ping() {
    const now = Date.now();
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    if (data.timestamp === undefined || data.timestamp.low === 0) {
      throw new CustomError(
        ErrorCodes.MISSING_FIELDS,
        '해당 timestamp 값이 제대로 조회되지 않습니다.',
      );
    }
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;

    console.log(`${this.id}: ${this.latency}`);
  }

  calculatePosition(latency) {
    // 이동을 하지 않는 중이라면 그냥 반환해줍니다.
    if (this.x === this.lastX && this.y === this.lastY) {
      return {
        x: this.x,
        y: this.y,
      };
    }

    const timeDiff = (Date.now() - this.lastUpdateTime + latency) / 1000;

    // 이동할 거리
    const distance = this.speed * timeDiff;

    // 이동할 방향
    const directionX = this.x !== this.lastX ? Math.sign(this.x - this.lastX) : 0; // 전 프레임값이 다르다면 Math.sign(this.x - this.lastX) 을 통해 -1 또는 1 부호값을 반환하여 이동할 방향을 구합니다.
    const directionY = this.y !== this.lastY ? Math.sign(this.y - this.lastY) : 0;

    return {
      x: this.x + directionX * distance,
      y: this.y + directionY * distance,
    };
  }
}

export default User;
