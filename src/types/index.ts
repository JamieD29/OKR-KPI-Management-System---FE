export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
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