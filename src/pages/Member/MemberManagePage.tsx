import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Shield,
  Briefcase,
  Building2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { AddMemberModal } from "./components/AddMemberModal";

// Định nghĩa độ ưu tiên cho Role để sắp xếp (Số càng nhỏ càng ưu tiên)
const ROLE_PRIORITY: Record<string, number> = {
  SYSTEM_ADMIN: 1,
  MANAGER: 2,
  USER: 3,
};

const ITEMS_PER_PAGE = 10; // Số lượng hiển thị mỗi trang

const MemberManagerPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);

  // --- 1. XỬ LÝ LỌC & TÌM KIẾM ---
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept =
        filterDept === "ALL" || member.department?.id === filterDept;
      return matchesSearch && matchesDept;
    });
  }, [members, searchTerm, filterDept]);

  // --- 2. XỬ LÝ SẮP XẾP (SORTING) ---
  // Ưu tiên: Role cao nhất -> Tên Phòng ban -> Tên người
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      // Tiêu chí 1: Role (Admin lên đầu)
      const roleA = ROLE_PRIORITY[a.roles[0]] || 99;
      const roleB = ROLE_PRIORITY[b.roles[0]] || 99;
      if (roleA !== roleB) return roleA - roleB;

      // Tiêu chí 2: Tên phòng ban (Gom nhóm)
      const deptA = a.department?.name || "zzz"; // 'zzz' để đẩy người không có phòng xuống cuối
      const deptB = b.department?.name || "zzz";
      if (deptA !== deptB) return deptA.localeCompare(deptB);

      // Tiêu chí 3: Tên người (ABC)
      return a.name.localeCompare(b.name);
    });
  }, [filteredMembers]);

  // --- 3. XỬ LÝ PHÂN TRANG (PAGINATION) ---
  const totalPages = Math.ceil(sortedMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedMembers.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedMembers, currentPage]);

  // Reset về trang 1 khi filter thay đổi
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDept]);

  const handleAddMember = (newMember: User) => {
    setMembers([newMember, ...members]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý thành viên
            </h1>
            <p className="text-gray-500 mt-1">
              Tổng số: <b>{members.length}</b> thành viên.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all"
          >
            <Plus size={20} /> Thêm thành viên
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <Filter size={18} className="text-gray-500" />
              <select
                className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                <option value="ALL">Tất cả đơn vị</option>
                {MOCK_DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[500px]">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <th className="px-6 py-4">Thành viên</th>
                  <th className="px-6 py-4 flex items-center gap-1 cursor-pointer hover:text-blue-600">
                    Đơn vị công tác <ArrowUpDown size={12} />
                  </th>
                  <th className="px-6 py-4">Vị trí / Chức danh</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedMembers.length > 0 ? (
                  paginatedMembers.map((member) => (
                    <tr
                      key={member.id}
                      onClick={() => navigate(`/admin/members/${member.id}`)}
                      className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            {member.avatarUrl ? (
                              <img
                                src={member.avatarUrl}
                                className="rounded-full h-full w-full object-cover"
                              />
                            ) : (
                              member.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {member.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Building2 size={16} className="text-gray-400" />
                          <span className="text-sm font-medium">
                            {member.department?.name || "---"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {member.jobTitle || "Chưa cập nhật"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {member.roles.map((role) => (
                            <span
                              key={role}
                              className={`
                              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                              ${
                                role === "SYSTEM_ADMIN"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : role === "MANAGER"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : "bg-gray-100 text-gray-700 border-gray-200"
                              }
                           `}
                            >
                              {role === "SYSTEM_ADMIN" && (
                                <Shield size={10} className="mr-1" />
                              )}
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/members/${member.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Không tìm thấy dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION CONTROLS --- */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-600">
            <div>
              Hiển thị <b>{paginatedMembers.length}</b> /{" "}
              <b>{sortedMembers.length}</b> kết quả
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="px-2 font-medium">
                Trang {currentPage} / {totalPages || 1}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMember}
      />
    </div>
  );
};

export default MemberManagerPage;
