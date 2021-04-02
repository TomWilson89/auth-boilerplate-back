import { Role } from './roles.interface';

export default class Roles {
  static ROLE = Role;

  static find = (): Role[] =>
    Object.keys(Role)
      .filter((e) => !Number.isNaN(Number(e)))
      .map((e) => Number(e));
}
