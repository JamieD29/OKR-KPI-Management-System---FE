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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* BREADCRUMBS */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          href="/dashboard"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          Dashboard
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <School sx={{ mr: 0.5 }} fontSize="inherit" />
          Quản lý Bộ môn
        </Typography>
      </Breadcrumbs>

      {/* HEADER & SEARCH */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 4,
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#1e3a8a">
            Danh sách Bộ môn
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Xem và quản lý cấu trúc nhân sự theo dạng danh sách
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm bộ môn..."
            value={deptSearch}
            onChange={(e) => setDeptSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: 'white', minWidth: 250 }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddModal(true)}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Thêm bộ môn
          </Button>
        </Box>
      </Box>

      {/* MASTER LIST (TABLE) */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          overflow: 'hidden', // Để border radius bo tròn đẹp
        }}
      >
        <Table aria-label="collapsible table">
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell width="50" />
              <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>
                TÊN BỘ MÔN
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 'bold', color: '#475569' }}
              >
                QUY MÔ
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 'bold', color: '#475569' }}
              >
                THAO TÁC
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => (
                <DepartmentRow
                  key={dept.id}
                  row={dept}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 5, color: 'text.secondary' }}
                >
                  Không tìm thấy bộ môn nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL ADD */}
      <AddDepartmentModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={fetchDepartments}
      />
    </Container>
  );
};;

export default DepartmentManagerPage;
