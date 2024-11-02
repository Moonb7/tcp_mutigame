import { createLocationPacket } from '../../utils/notigication/game.notification.js';
import LatencyManager from '../managers/latency.manager.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.latencyManager = new LatencyManager();
  }

  addUser(user) {
    this.users.push(user);

    this.latencyManager.addUser(user.id, user.ping.bind(user), 1000);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index != -1) {
      if (this.users.length === 1) {
        // 마지막 사람이 나간다면 해당 레이턴시 Interval로 실행되는 함수를 전부 지워줍니다.
        this.latencyManager.clearAll();
      }
      this.latencyManager.removeUser(this.users[index].id);
      return this.users.splice(index, 1)[0];
    }
  }

  // 해당 게임 세션에 참여한 유저 중 가장 높은 레이턴시(지연시간)을 가진 유저를 찾는 함수
  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
  }

  getAllLocation(userId) {
    const maxLatency = this.getMaxLatency();

    const locationData = this.users
      .filter((user) => user.id !== userId)
      .map((user) => {
        const { x, y } = user.calculatePosition(maxLatency);
        return { id: user.id, playerId: user.playerId, x, y };
      });

    return createLocationPacket(locationData);
  }
}

export default Game;
