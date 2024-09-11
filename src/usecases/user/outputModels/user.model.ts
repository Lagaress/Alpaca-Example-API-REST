import User from '../../../domain/User/User';

export type UserOutput = {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
};

export type UserPaginatedOutput = {
  total: number;
  users: UserOutput[];
};

export default function userModel(user: User): UserOutput {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    createdAt: user.createdAt.format(),
    updatedAt: user.updatedAt.format(),
  };
}

export function paginatedUserModel(
  users: User[],
  total: number,
): UserPaginatedOutput {
  return {
    total,
    users: users.map(userModel),
  };
}