import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Snackbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import {
  Save,
  VerifiedUser,
  School,
  Work,
  Edit,
  Cancel,
  CameraAlt,
  Badge,
} from '@mui/icons-material';
import { api } from '../services/api';

// Enum Data
const JOB_TITLES = [
  'Trưởng khoa',
  'Phó khoa',
  'Trưởng bộ môn',
  'Giảng viên',
  'Giảng viên chính',
  'Trợ giảng',
  'Giáo vụ',
  'Nghiên cứu viên',
];
const ACADEMIC_RANKS = ['Giáo sư', 'Phó giáo sư', 'Không'];
const DEGREES = ['Cử nhân', 'Thạc sĩ', 'Tiến sĩ', 'Không'];
const GENDERS = ['Nam', 'Nữ', 'Khác'];

export default function ProfileSetting() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // 👇 STATE MỚI: Chứa danh sách bộ môn từ API
  const [departments, setDepartments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roles: [] as string[],
    jobTitle: '',
    academicRank: 'Không',
    degree: 'Cử nhân',
    teachingHours: 0,
    awards: '',
    intellectualProperty: '',
    joinDate: '',
    gender: 'Nam',
    departmentID: '', // ID bộ môn đang chọn
    staffCode: '',
  });

  const [originalData, setOriginalData] = useState<any>(null);

  useEffect(() => {
    // Gọi cả 2 API cùng lúc khi vào trang
    const initData = async () => {
      setLoading(true);
      try {
        // 1. Lấy danh sách Departments trước
        const deptRes = await api.get('/departments');
        setDepartments(deptRes.data);

        // 2. Lấy Profile User
        await fetchProfile();
      } catch (error) {
        console.error('Lỗi khởi tạo:', error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      const u = res.data;

      const mappedData = {
        name: u.name || '',
        email: u.email || '',
        roles: u.roles || [],
        jobTitle: u.jobTitle || '',
        academicRank: u.academicRank || 'Không',
        degree: u.degree || 'Cử nhân',
        teachingHours: u.teachingHours || 0,
        awards: u.awards || '',
        intellectualProperty: u.intellectualProperty || '',
        joinDate: u.joinDate ? u.joinDate.split('T')[0] : '',
        gender: u.gender || 'Nam',
        // 👇 Quan trọng: Map ID từ object department về state
        departmentID: u.department ? u.department.id : '',
        staffCode: u.staffCode || '',
      };

      setFormData(mappedData);
      setOriginalData(mappedData);
    } catch (error) {
      console.error('Lỗi tải profile:', error);
      setNotification({
        type: 'error',
        message: 'Không thể tải thông tin cá nhân.',
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setNotification({ type: 'error', message: 'Đã hủy bỏ thay đổi.' });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 👇 Payload gửi đi: Nhớ kèm departmentId
      const payload = {
        name: formData.name,
        jobTitle: formData.jobTitle,
        academicRank: formData.academicRank,
        degree: formData.degree,
        teachingHours: Number(formData.teachingHours),
        awards: formData.awards,
        intellectualProperty: formData.intellectualProperty,
        joinDate: formData.joinDate,
        gender: formData.gender,
        departmentId: formData.departmentID, // Map đúng key DTO backend yêu cầu
        staffCode: formData.staffCode,
      };

      await api.patch('/users/profile', payload);

      setNotification({
        type: 'success',
        message: 'Cập nhật hồ sơ thành công!',
      });
      setOriginalData(formData);
      setIsEditing(false);

      // Cập nhật session storage để Header hiển thị tên mới nếu có đổi tên
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.name = formData.name;
        sessionStorage.setItem('user', JSON.stringify(user));
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || 'Có lỗi xảy ra khi lưu.';
      setNotification({
        type: 'error',
        message: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#1e3a8a">
            Hồ sơ cá nhân
          </Typography>
          <Typography color="text.secondary">
            Quản lý thông tin giảng viên & nghiên cứu khoa học
          </Typography>
        </Box>

        {!isEditing ? (
          <Button variant="contained" startIcon={<Edit />} onClick={handleEdit}>
            Chỉnh sửa
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={handleCancel}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={saving ? <CircularProgress size={20} /> : <Save />}
              onClick={handleSave}
              disabled={saving}
            >
              Lưu lại
            </Button>
          </Box>
        )}
      </Box>

      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={notification?.type}
          onClose={() => setNotification(null)}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* CỘT TRÁI: IDENTITY CARD */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              height: '100%',
            }}
          >
            <CardContent
              sx={{
                textAlign: 'center',
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  sx={{
                    width: 140,
                    height: 140,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: '#1e3a8a',
                    fontSize: 60,
                    border: '4px solid #e2e8f0',
                  }}
                  src={formData.name ? undefined : undefined}
                >
                  {formData.name.charAt(0)}
                </Avatar>
                <Tooltip title="Đổi ảnh đại diện (Chưa hỗ trợ)">
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: 0,
                      bgcolor: 'white',
                      border: '1px solid #e2e8f0',
                      '&:hover': { bgcolor: '#f1f5f9' },
                    }}
                    size="small"
                  >
                    <CameraAlt fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                {formData.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {formData.email}
              </Typography>

              <Divider sx={{ my: 2, width: '80%' }} />

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {formData.roles.map((role) => (
                  <Chip
                    key={role}
                    label={role === 'SYSTEM_ADMIN' ? 'Admin' : 'User'}
                    color={role === 'SYSTEM_ADMIN' ? 'error' : 'default'}
                    size="small"
                    icon={<VerifiedUser />}
                  />
                ))}
                <Chip
                  label={formData.jobTitle || 'Chưa cập nhật chức vụ'}
                  color="primary"
                  variant={formData.jobTitle ? 'filled' : 'outlined'}
                  size="small"
                  icon={<Work />}
                />
              </Box>

              <Box sx={{ mt: 3, width: '100%', px: 2 }}>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Học hàm
                    </Typography>
                    <Typography variant="subtitle2">
                      {formData.academicRank}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Học vị
                    </Typography>
                    <Typography variant="subtitle2">
                      {formData.degree}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* CỘT PHẢI: FORM CHI TIẾT */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            variant="outlined"
            sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#1e3a8a',
                }}
              >
                <School /> Thông tin chi tiết
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'filled'}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Mã cán bộ (Staff ID)"
                    placeholder="Ví dụ: VNU12345"
                    value={formData.staffCode}
                    onChange={(e) => handleChange('staffCode', e.target.value)}
                    disabled={!isEditing} // Chỉ cho sửa khi bấm Edit
                    variant={isEditing ? 'outlined' : 'filled'}
                    helperText="Mã định danh duy nhất của giảng viên"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl
                    fullWidth
                    variant={isEditing ? 'outlined' : 'filled'}
                  >
                    <InputLabel>Chức vụ / Vị trí</InputLabel>
                    <Select
                      value={formData.jobTitle}
                      label="Chức vụ / Vị trí"
                      onChange={(e) => handleChange('jobTitle', e.target.value)}
                      disabled={!isEditing}
                    >
                      {JOB_TITLES.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* 👇 KHU VỰC BỘ MÔN MỚI THÊM VÀO ĐÂY */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl
                    fullWidth
                    variant={isEditing ? 'outlined' : 'filled'}
                  >
                    <InputLabel>Bộ môn</InputLabel>
                    <Select
                      value={formData.departmentID || ''}
                      label="Bộ môn"
                      onChange={(e) =>
                        handleChange('departmentID', e.target.value)
                      }
                      disabled={!isEditing}
                    >
                      {/* Render từ State departments lấy từ API */}
                      <MenuItem value="">
                        <em>Chưa chọn</em>
                      </MenuItem>
                      {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* 👆 HẾT KHU VỰC BỘ MÔN */}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Ngày gia nhập trường"
                    InputLabelProps={{ shrink: true }}
                    value={formData.joinDate}
                    onChange={(e) => handleChange('joinDate', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'filled'}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl
                    fullWidth
                    variant={isEditing ? 'outlined' : 'filled'}
                  >
                    <InputLabel>Học hàm</InputLabel>
                    <Select
                      value={formData.academicRank}
                      label="Học hàm"
                      onChange={(e) =>
                        handleChange('academicRank', e.target.value)
                      }
                      disabled={!isEditing}
                    >
                      {ACADEMIC_RANKS.map((r) => (
                        <MenuItem key={r} value={r}>
                          {r}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl
                    fullWidth
                    variant={isEditing ? 'outlined' : 'filled'}
                  >
                    <InputLabel>Học vị</InputLabel>
                    <Select
                      value={formData.degree}
                      label="Học vị"
                      onChange={(e) => handleChange('degree', e.target.value)}
                      disabled={!isEditing}
                    >
                      {DEGREES.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl
                    fullWidth
                    variant={isEditing ? 'outlined' : 'filled'}
                  >
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      disabled={!isEditing}
                    >
                      {GENDERS.map((g) => (
                        <MenuItem key={g} value={g}>
                          {g}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Tổng giờ giảng (tiết/năm)"
                    value={formData.teachingHours}
                    onChange={(e) =>
                      handleChange('teachingHours', e.target.value)
                    }
                    helperText={
                      isEditing ? 'Số liệu dùng để tính KPI giảng dạy' : ''
                    }
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'filled'}
                    InputProps={{
                      endAdornment: (
                        <Typography variant="caption">Tiết</Typography>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 'bold' }}
                  >
                    <Badge sx={{ mr: 1 }} /> Thành tích & Nghiên cứu
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Khen thưởng & Danh hiệu"
                    placeholder={
                      isEditing
                        ? 'Ví dụ: Chiến sĩ thi đua cấp cơ sở 2024...'
                        : 'Chưa có thông tin'
                    }
                    value={formData.awards}
                    onChange={(e) => handleChange('awards', e.target.value)}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'filled'}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Sở hữu trí tuệ (Bằng sáng chế/Giải pháp)"
                    placeholder={
                      isEditing
                        ? 'Nhập danh sách các bằng sáng chế...'
                        : 'Chưa có thông tin'
                    }
                    value={formData.intellectualProperty}
                    onChange={(e) =>
                      handleChange('intellectualProperty', e.target.value)
                    }
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'filled'}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
