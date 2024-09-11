import User from '../../src/domain/User/User';

export class UserBuilder {
  private data: ConstructorParameters<typeof User>[0] = {
    id: 12412,
    nickname: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password',
    createdAt: 5461362678,
    updatedAt: 5461362678,
  };

  public with(key: string, value: unknown) {
    this.data[key] = value;
    return this;
  }

  public build(): User {
    return new User({
      ...this.data,
    });
  }
}
