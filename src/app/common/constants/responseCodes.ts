const ResponseCode = {
  BAD_REQUEST: {
    code: 400,
    message: 'Incorrect parameters sent.',
  },
  NOT_FOUND: {
    code: 404,
    message: 'Records not found.',
  },
  CONTENT_TOO_LARGE: {
    code: 413,
    message: 'Content too large.',
  },
  SERVER_ERROR: {
    code: 500,
    message:
      'It is not possible to establish communication with the server at this moment, please try again later.',
  },
  OK: {
    code: 200,
    message: 'OK',
  },
};

export default ResponseCode;
