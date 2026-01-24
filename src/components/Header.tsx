import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  AdminPanelSettings,
  Settings,
} from '@mui/icons-material';

const drawerWidth = 280;

interface HeaderProps {
  onToggleSidebar: () => void;
  user: any;
}

export default function Header({ onToggleSidebar, user }: HeaderProps) {
  const navigate = useNavigate();
  // const theme = useTheme(); // <-- Có thể xóa dòng này nếu không dùng theme ở chỗ khác
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const userRoles = Array.isArray(user.roles) ? user.roles : [];
  const isAdmin =
    userRoles.includes('SYSTEM_ADMIN') || userRoles.includes('admin');

  let displayRole = 'User';
  if (userRoles.length > 0 && typeof userRoles[0] === 'string') {
    displayRole = userRoles[0];
  } else if (typeof user.role === 'string') {
    displayRole = user.role;
  }

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'white',
        color: '#1e293b',
        borderBottom: '1px solid #e2e8f0',
        // 🔥 MAGIC LÀ Ở ĐÂY:
        width: { sm: `calc(100% - ${drawerWidth}px)` }, // Trên Desktop: Width = 100% - 280px
        ml: { sm: `${drawerWidth}px` }, // Đẩy sang phải 280px
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 2, display: { sm: 'none' } }} // 🔥 Chỉ hiện nút Menu trên Mobile. Desktop thì ẩn đi (vì Sidebar luôn hiện rồi)
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#1e3a8a',
          }}
        >
          HCMUS{' '}
          <Typography
            component="span"
            sx={{ color: '#64748b', fontWeight: 400 }}
          >
            | Performance Management System
          </Typography>
        </Typography>

        <Button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            textTransform: 'none',
            color: 'text.primary',
            borderRadius: '50px',
            bgcolor: 'rgba(241, 245, 249, 0.7)',
            border: '1px solid #e2e8f0',
            p: '4px 16px 4px 6px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: 'white',
              borderColor: '#cbd5e1',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          <Avatar
            src={user?.avatar}
            sx={{
              width: 38,
              height: 38,
              mr: 1.5,
              border: '2px solid #ffffff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              bgcolor: user?.avatar ? 'transparent' : '#3b82f6',
              fontWeight: 'bold',
            }}
          >
            {user?.name?.charAt(0)}
          </Avatar>

          <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: '#1e293b' }}
            >
              {user?.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.7rem' }}
            >
              {displayRole?.toUpperCase() || 'USER'}
            </Typography>
          </Box>
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { mt: 1, minWidth: 200 } }}
        >
          <MenuItem onClick={() => navigate('/profile')}>
            <Settings fontSize="small" style={{ marginRight: 10 }} /> Profile
            Settings
          </MenuItem>
          {isAdmin && (
            <MenuItem onClick={() => navigate('/admin/settings')}>
              <AdminPanelSettings fontSize="small" sx={{ mr: 1.5 }} /> Admin
              Portal
            </MenuItem>
          )}
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <Logout fontSize="small" sx={{ mr: 1.5 }} /> Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
