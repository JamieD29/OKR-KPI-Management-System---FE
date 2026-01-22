import React, { useState } from "react";
import { X } from "lucide-react";
import type { Department, DepartmentLevel } from "../../../types/models";

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (department: Omit<Department, "id">) => void; // Không cần ID vì sẽ tự sinh
  parentDept: Department | null; // Để biết đang thêm vào đâu
}

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  parentDept,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  // Tính toán cấp độ (Level) tự động
  // Nếu không có cha (parentDept == null) -> Level 1
  // Nếu cha là Level 1 -> Con là Level 2...
  const nextLevel = parentDept
    ? ((parentDept.level + 1) as DepartmentLevel)
    : 1;
  const parentName = parentDept ? parentDept.name : "Cấp cao nhất (Gốc)";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Gửi dữ liệu ra ngoài
    onAdd({
      name,
      level: nextLevel,
      parentId: parentDept ? parentDept.id : null,
    });

    // Reset form
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay làm tối nền */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Thêm đơn vị mới</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Thông báo đang thêm vào đâu */}
          <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm flex flex-col">
            <span className="text-xs font-semibold text-blue-600 uppercase">
              Đơn vị trực thuộc:
            </span>
            <span className="font-medium truncate">{parentName}</span>
            <span className="text-xs text-blue-500 mt-1">
              Hệ thống sẽ tạo đơn vị này ở <b>Level {nextLevel}</b>
            </span>
          </div>

          {/* Input Tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đơn vị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ví dụ: Bộ môn Kỹ thuật phần mềm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Input Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả (Tùy chọn)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              rows={3}
              placeholder="Mô tả chức năng, nhiệm vụ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all"
            >
              Tạo mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
