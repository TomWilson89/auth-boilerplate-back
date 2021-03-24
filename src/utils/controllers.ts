export function buildParams<T>(validParams: (keyof T)[], body: Partial<T>) {
  const params: Partial<T> = {};

  validParams.forEach((attr) => {
    if (body[attr] !== undefined) {
      params[attr] = body[attr];
    }
  });

  return params;
}
