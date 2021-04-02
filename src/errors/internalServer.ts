import HttpError from './http';

class InternalServerError extends HttpError {
  constructor() {
    super('InternalServer', 500);
  }
}

export default InternalServerError;
