import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Paper, Typography, Box, Link as MuiLink } from '@mui/material';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(name, email, password);
        if (success) {
            navigate('/');
        } else {
            alert('Kayıt başarısız! Lütfen bilgileri kontrol edin.');
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
                        Kayıt Ol
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Ad Soyad"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Adresi"
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
                            Kayıt Ol
                        </Button>
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                             <MuiLink component={Link} to="/login" variant="body2" underline="hover">
                                {"Zaten hesabın var mı? Giriş Yap"}
                            </MuiLink>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;
