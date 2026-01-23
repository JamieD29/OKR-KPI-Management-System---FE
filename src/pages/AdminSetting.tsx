import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import { Add, Delete, Info } from '@mui/icons-material';
import { api } from '../services/api';
import type { Domain } from '../types';

export default function AdminSettings() {
  const navigate = useNavigate();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainInput, setDomainInput] = useState(''); // Đổi tên biến để nhập Full Domain
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('user');
    // --- GIỮ LẠI LOGIC CHECK QUYỀN "XỊN" ---
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const roles = user.roles || [];
      const isAdmin =
        roles.includes('SYSTEM_ADMIN') ||
        roles.includes('admin') ||
        user.role === 'admin';

      if (!isAdmin) {
        navigate('/dashboard', { replace: true });
        return;
      }
    } else {
      navigate('/login', { replace: true });
      return;
    }
    // ----------------------------------------
    fetchDomains();
  }, [navigate]);

  const fetchDomains = async () => {
    try {
      const response = await api.get<{ domains: Domain[] }>('/admin/domains');
      setDomains(response.data.domains);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDomain = async () => {
    // 1. Logic mới: Nhập full domain -> Trim -> Lowercase
    const rawDomain = domainInput.trim().toLowerCase();

    if (!rawDomain) {
      showMessage('error', 'Please enter a domain');
      return;
    }

    // 2. Validate Đa năng (Regex mới)
    // Chấp nhận: gmail.com, fit.hcmus.edu.vn, abc.xyz
    const domainRegex =
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;

    if (!domainRegex.test(rawDomain)) {
      showMessage(
        'error',
        'Invalid domain format. Example: gmail.com, fit/itec.hcmus.edu.vn',
      );
      return;
    }

    // 3. Check trùng (So sánh full domain)
    if (domains.some((d) => d.domain.toLowerCase() === rawDomain)) {
      showMessage('error', 'This domain is already in the allowlist');
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.post<{ domain: Domain }>('/admin/domains', {
        domain: rawDomain,
      });
      setDomains([...domains, response.data.domain]); // Thêm xuống cuối hoặc đầu tùy mày
      setDomainInput(''); // Clear input
      showMessage('success', `Domain ${rawDomain} added successfully`);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to add domain';
      showMessage('error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    if (
      !window.confirm(
        'Are you sure you want to remove this domain? Users with this domain will no longer be able to log in.',
      )
    ) {
      return;
    }

    setIsSaving(true);
    try {
      await api.delete(`/admin/domains/${domainId}`);
      setDomains(domains.filter((d) => d.id !== domainId));
      showMessage('success', 'Domain removed successfully');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to remove domain';
      showMessage('error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">Loading settings...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header Giữ nguyên */}
      {/* Header dạng Breadcrumb - Gọn gàng & Chuyên nghiệp hơn */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: 1,
          borderColor: 'divider',
          py: 2,
          px: 3,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          {/* Dòng đường dẫn nhỏ bên trên */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 0.5,
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            <Typography
              component="span"
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Typography>
            <span>/</span>
            <Typography component="span" color="text.primary" fontWeight={500}>
              Administration
            </Typography>
          </Box>

          {/* Tiêu đề chính */}
          <Typography variant="h4" fontWeight="bold" color="#111827">
            Admin Settings
          </Typography>
        </Box>
      </Box>

      {/* Main Content Giữ nguyên layout */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {message && (
          <Alert
            severity={message.type}
            onClose={() => setMessage(null)}
            sx={{ mb: 3 }}
          >
            {message.text}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Allowed Email Domains
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add email domains that are authorized to access the system.
            </Typography>

            {/* UI Nhập Domain (Đã bỏ cái đuôi cứng .hcmus.edu.vn) */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Enter full domain (e.g., <strong>gmail.com</strong>,{' '}
                <strong>fit/itec.hcmus.edu.vn</strong>)
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  placeholder="example.com"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value.toLowerCase())}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddDomain();
                    }
                  }}
                  disabled={isSaving}
                  size="small"
                  // 🔥 Đã xóa InputAdornment (cái đuôi cố định) để nhập tự do
                  helperText={
                    domainInput.trim()
                      ? `Adding: @${domainInput.trim()}`
                      : 'Only lowercase letters, numbers, hyphens and dots allowed'
                  }
                />
                <Button
                  variant="contained"
                  onClick={handleAddDomain}
                  disabled={isSaving || !domainInput.trim()}
                  startIcon={
                    isSaving ? <CircularProgress size={20} /> : <Add />
                  }
                  sx={{ minWidth: 140, height: 40 }}
                >
                  Add
                </Button>
              </Box>
            </Box>

            {/* List Domain (Giữ nguyên style xám) */}
            {domains.length > 0 ? (
              <List sx={{ bgcolor: 'grey.50', borderRadius: 1 }}>
                {domains.map((domain, index) => (
                  <React.Fragment key={domain.id || index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Chip
                              // 🔥 Hiển thị full domain luôn
                              label={`@${domain.domain}`}
                              color="primary"
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Added on{' '}
                            {domain.addedAt
                              ? new Date(domain.addedAt).toLocaleDateString()
                              : 'N/A'}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteDomain(domain.id)}
                          disabled={isSaving}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < domains.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  border: 2,
                  borderStyle: 'dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  color: 'text.secondary',
                }}
              >
                <Typography>
                  No domains configured. Add your first domain to get started.
                </Typography>
              </Box>
            )}

            {/* Info Box (Cập nhật text) */}
            <Alert severity="info" icon={<Info />} sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Domain Policy
              </Typography>
              <Typography variant="body2">
                • You can add any valid domain (e.g. <strong>gmail.com</strong>,{' '}
                <strong>abc.com</strong>)
                <br />• Users with emails matching these domains will be allowed
                to log in.
                <br />• Removing a domain will immediately revoke access for
                those users.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
