import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Paper, Typography, Box, Link as MuiLink } from '@mui/material';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/');
        } else {
            alert('Giriş başarısız! Lütfen bilgilerinizi kontrol edin.');
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: '#f4f6f8' 
        }}>
            <Container maxWidth="xs">
                <Paper 
                    elevation={6} 
                    sx={{ 
                        p: 4, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        borderRadius: 4
                    }}
                >
                    <Typography component="h1" variant="h5" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
                        Giriş Yap
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Adresi"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Şifre"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ py: 1.5, borderRadius: 2, fontSize: '1rem', textTransform: 'none' }}
                        >
                            Giriş Yap
                        </Button>
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <MuiLink component={Link} to="/register" variant="body2" underline="hover">
                                {"Hesabın yok mu? Kayıt Ol"}
                            </MuiLink>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
