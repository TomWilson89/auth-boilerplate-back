export enum Role {
  USER = 1,
  ADMIN,
}

export interface IRole {
  id: Role;
  name: string;
}

export default {};
