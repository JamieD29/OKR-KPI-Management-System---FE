import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  Trophy,
  FileText,
  Activity,
} from "lucide-react";
import { MOCK_USERS } from "../../../mocks/mockData";

const MemberDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Tìm thành viên theo ID
  const member = MOCK_USERS.find((u) => u.id === id);

  if (!member) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">
          Không tìm thấy thành viên!
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Nút Quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Quay lại danh sách</span>
        </button>

        {/* HEADER CARD: Ảnh bìa & Thông tin cơ bản */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Ảnh bìa */}
          <div className="h-40 bg-gradient-to-r from-blue-700 to-indigo-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div className="px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-4 gap-6">
              {/* Avatar */}
              <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-4xl font-bold text-blue-600 uppercase overflow-hidden">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  member.name.charAt(0)
                )}
              </div>

              {/* Tên & Chức vụ */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {member.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600">
                  <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Briefcase size={14} /> {member.jobTitle || "Thành viên"}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    <Activity size={14} />{" "}
                    {member.department?.name || "Chưa phân bổ"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 sm:mt-0">
                <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
                  Nhắn tin
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm">
                  Chỉnh sửa hồ sơ
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CỘT TRÁI: Thông tin chi tiết */}
          <div className="lg:col-span-1 space-y-6">
            {/* Thông tin liên hệ */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                Thông tin liên hệ
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <span className="block text-gray-500 text-xs uppercase font-semibold">
                      Email
                    </span>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <span className="block text-gray-500 text-xs uppercase font-semibold">
                      Điện thoại
                    </span>
                    <span className="text-gray-900">0909 123 456 (Demo)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <span className="block text-gray-500 text-xs uppercase font-semibold">
                      Văn phòng
                    </span>
                    <span className="text-gray-900">Phòng I.53, Tòa nhà I</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Calendar className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <span className="block text-gray-500 text-xs uppercase font-semibold">
                      Ngày tham gia
                    </span>
                    <span className="text-gray-900">
                      {member.joinDate || "---"}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Học vấn */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                Học vấn & Học hàm
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Học vị cao nhất</p>
                  <p className="font-bold text-gray-900 text-lg">
                    {member.degree || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
              {member.academicRank && (
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                    <Award size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Học hàm</p>
                    <p className="font-bold text-gray-900 text-lg">
                      {member.academicRank}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: Nội dung chính */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-gray-500 text-sm font-medium mb-1">
                  Giờ giảng dạy
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {member.teachingHours || 0}{" "}
                  <span className="text-sm font-normal text-gray-400">
                    tiết
                  </span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-gray-500 text-sm font-medium mb-1">
                  OKRs đang chạy
                </div>
                <div className="text-2xl font-bold text-blue-600">3</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-gray-500 text-sm font-medium mb-1">
                  NCKH & Bài báo
                </div>
                <div className="text-2xl font-bold text-green-600">5</div>
              </div>
            </div>

            {/* Giải thưởng & Thành tựu */}
            {(member.awards || member.intellectualProperty) && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Thành tựu nổi bật
                </h3>

                {member.awards && (
                  <div className="mb-4">
                    <h4 className="flex items-center gap-2 font-semibold text-yellow-700 mb-2">
                      <Trophy size={18} /> Các giải thưởng
                    </h4>
                    <p className="bg-yellow-50 p-3 rounded-lg text-gray-800 text-sm leading-relaxed border border-yellow-100">
                      {member.awards}
                    </p>
                  </div>
                )}

                {member.intellectualProperty && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-blue-700 mb-2">
                      <FileText size={18} /> Sở hữu trí tuệ / Bài báo
                    </h4>
                    <p className="bg-blue-50 p-3 rounded-lg text-gray-800 text-sm leading-relaxed border border-blue-100">
                      {member.intellectualProperty}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab điều hướng nội dung (Placeholder) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[200px] flex items-center justify-center text-gray-400 flex-col border-dashed">
              <BookOpen size={40} className="mb-2 opacity-50" />
              <p>
                Khu vực hiển thị chi tiết tiến độ OKRs và KPIs của giảng viên
                này.
              </p>
              <button className="mt-4 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                Xem OKRs chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailPage;
