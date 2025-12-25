export type Role = 'ADMIN' | 'BASIC';

export const users = [
  {
    email: 'admin@test.com',
    password: '1234',
    role: 'ADMIN' as Role,
  },
  {
    email: 'user@test.com',
    password: '1234',
    role: 'BASIC' as Role,
  },
];

export default users;
