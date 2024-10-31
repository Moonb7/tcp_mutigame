import { ErrorCodes } from '../../constants/codes/errorCodes.js';
import CustomError from '../../utils/error/customError.js';

class LatencyManager {
  constructor() {
    this.intervals = new Map();
  }

  addUser(userId, callback, timestamp) {
    if (this.intervals.has(userId)) {
      console.error('중복된 인터벌이 확인됩니다.');
      // throw new CustomError(ErrorCodes.)
    }
    this.intervals.set(userId, setInterval(callback, timestamp));
  }

  removeUser(userId) {
    if (!this.intervals.has(userId)) {
      return;
    }
    clearInterval(this.intervals.get(userId));
  }

  clearAll() {
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });

    this.intervals.clear();
  }
}

export default LatencyManager;
