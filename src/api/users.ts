export type UserDto = {
  userID?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
};

const MOCK_USERS: UserDto[] = [
  { userID: 'u-1001', name: 'Michael Roberts', email: 'michael.roberts@example.com', phone: '+94 77 123 4567', role: 'Employee', isActive: true },
  { userID: 'u-1002', name: 'Sarah Fernando', email: 'sarah.fernando@example.com', phone: '+94 77 987 6543', role: 'Customer', isActive: true },
  { userID: 'u-1003', name: 'Kevin Perera', email: 'kevin.perera@example.com', phone: '+94 77 555 1212', role: 'Customer', isActive: true },
  { userID: 'u-1004', name: 'Nimal Jayawardena', email: 'nimal.j@example.com', phone: '+94 71 234 5678', role: 'Mechanic', isActive: true },
  { userID: 'u-1005', name: 'Anusha Wickramasinghe', email: 'anusha.w@example.com', phone: '+94 71 765 4321', role: 'Supervisor', isActive: true },
  { userID: 'u-1006', name: 'Rohan Silva', email: 'rohan.silva@example.com', phone: '+94 71 111 2222', role: 'Employee', isActive: false },
  { userID: 'u-1007', name: 'Priyanka Senanayake', email: 'priyanka.s@example.com', phone: '+94 71 333 4444', role: 'Customer', isActive: true },
  { userID: 'u-1008', name: 'Kasun Perera', email: 'kasun.p@example.com', phone: '+94 71 444 5555', role: 'Mechanic', isActive: true },
  { userID: 'u-1009', name: 'Dilshan Kumara', email: 'dilshan.k@example.com', phone: '+94 71 666 7777', role: 'Employee', isActive: true },
  { userID: 'u-1010', name: 'Manori De Silva', email: 'manori.ds@example.com', phone: '+94 71 888 9999', role: 'Customer', isActive: false },
  { userID: 'u-1011', name: 'Samantha Jayasuriya', email: 'samantha.j@example.com', phone: '+94 71 101 2020', role: 'Admin', isActive: true },
  { userID: 'u-1012', name: 'Roshan Fernando', email: 'roshan.f@example.com', phone: '+94 71 303 4040', role: 'Employee', isActive: true },
  { userID: 'u-1013', name: 'Lakmini Perera', email: 'lakmini.p@example.com', phone: '+94 71 505 6060', role: 'Customer', isActive: true },
  { userID: 'u-1014', name: 'Chaminda Nawarathne', email: 'chaminda.n@example.com', phone: '+94 71 707 8080', role: 'Manager', isActive: true },
  { userID: 'u-1015', name: 'Tharuka Silva', email: 'tharuka.s@example.com', phone: '+94 71 909 0101', role: 'Employee', isActive: true },
  { userID: 'u-1016', name: 'Yasodha Rajapaksa', email: 'yasodha.r@example.com', phone: '+94 71 121 3141', role: 'Customer', isActive: true },
  { userID: 'u-1017', name: 'Kavindu Senarath', email: 'kavindu.s@example.com', phone: '+94 71 151 6171', role: 'Mechanic', isActive: false },
  { userID: 'u-1018', name: 'Imal Perera', email: 'imal.p@example.com', phone: '+94 71 181 9202', role: 'Employee', isActive: true },
  { userID: 'u-1019', name: 'Nishantha Rodrigo', email: 'nishantha.r@example.com', phone: '+94 71 212 2232', role: 'Customer', isActive: true },
  { userID: 'u-1020', name: 'Gayani Hemachandra', email: 'gayani.h@example.com', phone: '+94 71 242 5262', role: 'Employee', isActive: true },
  { userID: 'u-1021', name: 'Harsha Madusanka', email: 'harsha.m@example.com', phone: '+94 71 272 8292', role: 'Customer', isActive: true },
  { userID: 'u-1022', name: 'Udara Perera', email: 'udara.p@example.com', phone: '+94 71 303 0303', role: 'Employee', isActive: true },
  { userID: 'u-1023', name: 'Sudeepa Gamage', email: 'sudeepa.g@example.com', phone: '+94 71 323 4343', role: 'Manager', isActive: true },
  { userID: 'u-1024', name: 'Kasuni Wijesinghe', email: 'kasuni.w@example.com', phone: '+94 71 343 4545', role: 'Customer', isActive: false },
  { userID: 'u-1025', name: 'Ravindra Jayawardena', email: 'ravindra.j@example.com', phone: '+94 71 363 4747', role: 'Employee', isActive: true },
];

export async function fetchUsers(): Promise<UserDto[]> {
  return Promise.resolve(MOCK_USERS.map(u => ({ ...u })));
}
