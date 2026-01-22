// src/types/models.ts

export type DepartmentLevel = 1 | 2 | 3;

export interface Department {
  id: string;
  name: string;
  level: DepartmentLevel;
  parentId: string | null;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  departmentId: string;
  okrStatus: number; // 0 - 100%
}
