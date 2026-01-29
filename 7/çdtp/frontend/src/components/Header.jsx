import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Container } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'primary.light' : 'inherit';

    return (
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ flexDirection: { xs: 'column', sm: 'row' }, py: 1 }}>
                <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                            flexGrow: 1, 
                            fontWeight: 'bold', 
                            letterSpacing: 0.5,
                            mb: { xs: 1, sm: 0 },
                            textAlign: { xs: 'center', sm: 'left' },
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                <Link to="/" >

                        SAĞLIK TAKİP
                </Link>
                    </Typography>
                    
                    {user && (
                        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, justifyContent: 'center' }}>
                            <Button 
                                color="inherit" 
                                component={Link} 
                                to="/"
                                startIcon={<DashboardIcon />}
                                sx={{ bgcolor: isActive('/'), '&:hover': { bgcolor: 'primary.dark' } }}
                            >
                                Özet
                            </Button>
                            <Button 
                                color="inherit" 
                                component={Link} 
                                to="/analysis"
                                startIcon={<AnalyticsIcon />}
                                sx={{ bgcolor: isActive('/analysis'), '&:hover': { bgcolor: 'primary.dark' } }}
                            >
                                Analizler
                            </Button>
                            <Button 
                                color="inherit" 
                                component={Link} 
                                to="/settings"
                                startIcon={<SettingsIcon />}
                                sx={{ bgcolor: isActive('/settings'), '&:hover': { bgcolor: 'primary.dark' } }}
                            >
                                Ayarlar
                            </Button>
                            <IconButton color="inherit" onClick={handleLogout} title="Çıkış">
                                <LogoutIcon />
                            </IconButton>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
