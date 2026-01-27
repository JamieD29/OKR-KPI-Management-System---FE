import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Container,
} from '@mui/material';
import { Add, Delete, Edit, Groups } from '@mui/icons-material';
import { api } from '../services/api';
import AddDepartmentModal from './components/AddDepartmentModal';

// Interface dữ liệu
interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  memberCount?: number; // Trường mới thêm từ Backend
}

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  // Hàm load dữ liệu
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
    } catch (error) {
      console.error('Lỗi tải danh sách:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Hàm xóa
  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Bạn có chắc muốn xóa bộ môn "${name}"? Hành động này không thể hoàn tác!`,
      )
    ) {
      try {
        await api.delete(`/departments/${id}`);
        fetchDepartments(); // Load lại list sau khi xóa
      } catch (error) {
        alert('Xóa thất bại (Có thể bộ môn này đang có thành viên)');
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 4,
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#1e3a8a">
            Quản lý Bộ môn
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Danh sách các bộ môn và đơn vị trực thuộc
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenAddModal(true)}
          sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
        >
          Thêm bộ môn
        </Button>
      </Box>

      {/* DANH SÁCH (GRID) */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : departments.length === 0 ? (
        <Typography align="center" sx={{ mt: 5, color: 'text.secondary' }}>
          Chưa có bộ môn nào.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {departments.map((dept) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={dept.id}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 3,
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={dept.code}
                      color="primary"
                      size="small"
                      variant="filled"
                    />
                    {/* Menu Edit/Delete sẽ nằm đây */}
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    noWrap
                    title={dept.name}
                  >
                    {dept.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, height: 40, overflow: 'hidden' }}
                  >
                    {dept.description || 'Chưa có mô tả'}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                    }}
                  >
                    <Groups fontSize="small" />
                    <span>{dept.memberCount || 0} thành viên</span>
                  </Box>
                </CardContent>

                <CardActions
                  sx={{
                    borderTop: '1px solid #f1f5f9',
                    justifyContent: 'flex-end',
                    px: 2,
                  }}
                >
                  <Tooltip title="Chỉnh sửa (Sắp có)">
                    <IconButton size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa bộ môn">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(dept.id, dept.name)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* MODAL THÊM MỚI */}
      <AddDepartmentModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={fetchDepartments}
      />
    </Container>
  );
}
