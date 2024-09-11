import Entity, { EntityParams } from '../Entity';

type UserParams = EntityParams & {
  email: string;
  nickname: string;
  password: string;
}

export default class User extends Entity {
  public email: string;
  public nickname: string;
  public password: string;

  constructor(user: UserParams) {
    super(user);
    this.email = user.email;
    this.nickname = user.nickname;
    this.password = user.password;
  }

  public get userId(): number {
    return this.id;
  }
}

