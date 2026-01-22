import type { Department } from "../types/models";

export const MOCK_DEPARTMENTS: Department[] = [
  // Level 1
  { id: "lv1_1", name: "Khoa Công Nghệ Thông Tin", level: 1, parentId: null },
  { id: "lv1_2", name: "Khoa Vật Lý", level: 1, parentId: null },
  // Level 2
  {
    id: "lv2_1",
    name: "Bộ môn Công nghệ phần mềm",
    level: 2,
    parentId: "lv1_1",
  },
  { id: "lv2_2", name: "Bộ môn Mạng máy tính", level: 2, parentId: "lv1_1" },
  // Level 3
  { id: "lv3_1", name: "Nhóm R&D Web App", level: 3, parentId: "lv2_1" },
  { id: "lv3_2", name: "Tổ Giáo vụ CNPM", level: 3, parentId: "lv2_1" },
];
