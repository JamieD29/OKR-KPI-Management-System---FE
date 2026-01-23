export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  roles: string[]; // ['SYSTEM_ADMIN', 'USER'...]
  department?: {
    id: string;
    name: string;
  };

  // 🔥 THÊM CÁC TRƯỜNG MỚI VÀO ĐÂY
  jobTitle?: string; // Trưởng khoa, Giảng viên...
  academicRank?: string; // GS, PGS...
  degree?: string; // TS, ThS...
  teachingHours?: number;
  awards?: string;
  intellectualProperty?: string;
  joinDate?: string;
}

export interface OKR {
  id: string;
  title: string;
  description?: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'behind';
  dueDate: string | null;
}

export interface KPI {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
}

export interface Domain {
  id: string;
  domain: string;
  addedAt: string;
}
