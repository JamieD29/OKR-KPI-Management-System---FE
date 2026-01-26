// src/features/users/components/AddMemberModal.tsx
import React, { useState } from "react";
import { X, User as UserIcon, Mail, Briefcase, Building } from "lucide-react";
import type { Department, User as UserModel } from "../../../types/index";
import { MOCK_DEPARTMENTS } from "../../../mocks/mockData";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: UserModel) => void; // Đổi tên biến user -> member
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobTitle: "",
    departmentId: "",
    role: "USER",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDept = MOCK_DEPARTMENTS.find(
      (d) => d.id === formData.departmentId,
    );

    const newMember: UserModel = {
      id: `m_${Date.now()}`, // Đổi prefix id từ u_ sang m_
      name: formData.name,
      email: formData.email,
      roles: [formData.role],
      jobTitle: formData.jobTitle,
      department: selectedDept
        ? { id: selectedDept.id, name: selectedDept.name }
        : undefined,
      joinDate: new Date().toISOString().split("T")[0],
      teachingHours: 0,
    };

    onAdd(newMember);
    onClose();
    setFormData({
      name: "",
      email: "",
      jobTitle: "",
      departmentId: "",
      role: "USER",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
          {/* Đổi text hiển thị */}
          <h3 className="text-lg font-bold">Thêm thành viên mới</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên thành viên
              </label>
              <div className="relative">
                <UserIcon
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  required
                  type="text"
                  className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  required
                  type="email"
                  className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="email@hcmus.edu.vn"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đơn vị trực thuộc
            </label>
            <div className="relative">
              <Building
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <select
                className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData({ ...formData, departmentId: e.target.value })
                }
              >
                <option value="">-- Chọn đơn vị --</option>
                {MOCK_DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chức danh / Vị trí
              </label>
              <div className="relative">
                <Briefcase
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  required
                  type="text"
                  className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Giảng viên, Trưởng khoa..."
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quyền hạn
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="USER">Member (Thành viên)</option>
                <option value="MANAGER">Manager (Quản lý)</option>
                <option value="SYSTEM_ADMIN">Admin hệ thống</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
            >
              Thêm thành viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
