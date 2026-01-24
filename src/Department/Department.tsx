import { useState } from "react";
import type { Department, User } from "../types/index";
import { MOCK_DEPARTMENTS, MOCK_USERS } from "../mocks/mockData";

import { Breadcrumb } from "./components/Breadcrumb";
import { DepartmentGrid } from "./components/DepartmentGrid";
import { MemberTable } from "./components/MemberTable";
import { MemberDetailModal } from "./components/MemberDetailModal";
import { AddDepartmentModal } from './components/AddDepartmentModal';
 // Import Modal mới
const DepartmentManagerPage = () => {
  const [departments, setDepartments] =
    useState<Department[]>(MOCK_DEPARTMENTS);
  const [navPath, setNavPath] = useState<Department[]>([]);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const currentDept = navPath.length > 0 ? navPath[navPath.length - 1] : null;

  // Lọc danh sách hiển thị từ State (không phải từ Mock trực tiếp nữa)
  const displayDepartments = departments.filter((d) =>
    currentDept ? d.parentId === currentDept.id : d.level === 1,
  );

  const displayMembers =
    currentDept?.level === 3
      ? MOCK_USERS.filter((m) => m.department?.id === currentDept.id)
      : [];

  const handleBreadcrumbClick = (dept: Department | null) => {
    if (!dept) {
      setNavPath([]);
    } else {
      const index = navPath.findIndex((d) => d.id === dept.id);
      setNavPath(navPath.slice(0, index + 1));
    }
  };

  const handleDeptClick = (dept: Department) => {
    setNavPath([...navPath, dept]);
  };

  const handleAddDepartment = (newDeptData: Omit<Department, "id">) => {
    const newDepartment: Department = {
      ...newDeptData,
      id: `new_${Date.now()}`, // Tạo ID giả
    };

    // Cập nhật State danh sách
    setDepartments([...departments, newDepartment]);

    // (Thực tế chỗ này bạn sẽ gọi API: await departmentService.create(newDepartment))
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý cơ cấu tổ chức
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Hệ thống quản lý: Khoa &gt; Bộ môn &gt; Tổ/Nhóm &gt; Thành viên
          </p>
        </div>

        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb path={navPath} onNavigate={handleBreadcrumbClick} />
        </div>

        {/* Main Content Area - Card trắng nền */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
          {/* Case 1: Hiển thị Folder (Level 1, 2) */}
          {(!currentDept || currentDept.level < 3) && (
            <DepartmentGrid
              departments={displayDepartments}
              currentDept={currentDept}
              onSelect={handleDeptClick}
              onAddClick={() => setIsAddModalOpen(true)}
            />
          )}

          {/* Case 2: Hiển thị Bảng thành viên (Level 3) */}
          {currentDept?.level === 3 && (
            <MemberTable
              members={displayMembers}
              departmentName={currentDept.name}
              onSelectMember={setSelectedMember}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* Modal Thêm Đơn vị mới (Đã kết nối) */}
      <AddDepartmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddDepartment}
        parentDept={currentDept} // Truyền vị trí hiện tại vào để biết cha là ai
      />
    </div>
  );
};;

export default DepartmentManagerPage;
