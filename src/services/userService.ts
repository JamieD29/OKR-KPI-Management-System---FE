// src/services/userService.ts
import { MOCK_USERS } from "../mocks/users";
import type { User } from "../types/models";

// Giả lập độ trễ mạng (500ms)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const userService = {
  // Lấy tất cả user
  getAll: async (): Promise<User[]> => {
    await delay(500); // Giả vờ loading
    return MOCK_USERS;
  },

  // Lấy user theo phòng ban (Chức năng bạn đang cần)
  getByDepartment: async (deptId: string): Promise<User[]> => {
    await delay(300);
    return MOCK_USERS.filter((u) => u.departmentId === deptId);
  },

  // Lấy chi tiết 1 user
  getById: async (id: string): Promise<User | undefined> => {
    await delay(300);
    return MOCK_USERS.find((u) => u.id === id);
  },
};
