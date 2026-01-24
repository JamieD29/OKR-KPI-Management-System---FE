import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';

const drawerWidth = 280;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
    },
    {
      text: 'Departments',
      icon: <Building2 size={20} />,
      path: '/admin/department',
    },
    { text: 'Research & Docs', icon: <BookOpen size={20} />, path: '/docs' },
  ];

  // Nội dung bên trong Sidebar (Dùng chung cho cả Mobile và PC)
  const drawerContent = (
    <div>
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            bgcolor: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <GraduationCap size={32} color="#1e3a8a" />
        </Box>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
          VNU-HCMUS
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ display: 'block', mb: 1 }}
          >
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                onClose(); // Đóng nếu đang ở mobile
              }}
              sx={{
                borderRadius: 2,
                minHeight: 48,
                color: 'white',
                bgcolor:
                  location.pathname === item.path
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                borderLeft:
                  location.pathname === item.path
                    ? '4px solid #60a5fa'
                    : '4px solid transparent',
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path ? '#60a5fa' : 'inherit',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box
        sx={{
          p: 2,
          mt: 'auto',
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
      >
        <ListItemButton sx={{ borderRadius: 2, color: 'white' }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <HelpCircle size={20} />
          </ListItemIcon>
          <ListItemText primary="IT Support" />
        </ListItemButton>
      </Box>
    </div>
  );

  const sidebarStyles = {
    bgcolor: '#1e3a8a',
    background: 'linear-gradient(180deg, #1e3a8a 0%, #172554 100%)',
    color: 'white',
    borderRight: 'none',
  };

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* 1. Drawer cho Mobile (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }} // Tốt cho SEO/Mobile performance
        sx={{
          display: { xs: 'block', sm: 'none' }, // Chỉ hiện khi màn hình nhỏ (xs)
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            ...sidebarStyles,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 2. Drawer cho Desktop (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' }, // Ẩn khi màn hình nhỏ, hiện khi màn hình lớn (sm trở lên)
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            ...sidebarStyles,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
