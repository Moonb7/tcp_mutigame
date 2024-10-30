import { createResponse } from '../response/createResponse.js';

export const handlerError = (socket, error) => {
  let responseCode;
  let message;
  console.log(error);

  if (error.code) {
    responseCode = error.code;
    message = error.message;
    console.error(`에러코드: ${error.code}, 메세지: ${error.message}`);
  } else {
    responseCode = ErrorCodes.SOCKET_ERROR;
    message = error.message;
    console.error(`일반에러: ${error.message}`);
  }

  const errorResponse = createResponse(-1, responseCode, { message }, userId);

  socket.write(errorResponse);
};
