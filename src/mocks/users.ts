// src/mocks/users.ts
import type { Member } from "../types/models";

export const MOCK_MEMBERS: Member[] = [
  {
    id: "m1",
    name: "Nguyễn Văn A",
    role: "Trưởng nhóm",
    email: "nva@hcmus.edu.vn",
    departmentId: "lv3_1",
    okrStatus: 85,
  },
  {
    id: "m2",
    name: "Trần Thị B",
    role: "Giảng viên",
    email: "ttb@hcmus.edu.vn",
    departmentId: "lv3_1",
    okrStatus: 40,
  },
  {
    id: "m3",
    name: "Lê Văn C",
    role: "Nghiên cứu viên",
    email: "lvc@hcmus.edu.vn",
    departmentId: "lv3_1",
    okrStatus: 60,
  },
];