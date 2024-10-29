class CustomError extends Error {
  /**
   * 에러 코드와 에러 메세지
   * @param {*} code
   * @param {*} message
   */
  constructor(code, message) {
    super(message); // 해당 Error부모객체의 생성자로 만들고
    this.code = code;
    this.name = 'CustomError';
  }
}

export default CustomError;
