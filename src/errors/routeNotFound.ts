import HttpError from './http';

class RouteNotFound extends HttpError {
  constructor(params = {}) {
    super('RouteNotFound', 404, params);
  }
}

export default RouteNotFound;
