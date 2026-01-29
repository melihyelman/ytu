import React, { useEffect, useState, useContext } from 'react';
import { Container, Grid, Paper, Typography, Box, useTheme, Button } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { io } from "socket.io-client";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [currentStatus, setCurrentStatus] = useState('Normal');
    const [currentHeartRate, setCurrentHeartRate] = useState(0);
    const [sensorData, setSensorData] = useState([]);
    const theme = useTheme();

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/sensor/history`, config);
            
            if (data.length > 0) {
                setSensorData(data);
                const newest = data[0]; // sorted desc
                setCurrentStatus(newest.motionStatus);
                setCurrentHeartRate(newest.heartRate);
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
        const socket = io(import.meta.env.VITE_API_URL, {
            auth: {
                token: user?.token
            }
        });
        socket.on("connect_error", (err) => {
            console.error("Socket Connection Error:", err.message);
        });
        socket.on("newData", (data) => {
            setCurrentStatus(data.motionStatus);
            setCurrentHeartRate(data.heartRate);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleEmergency = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.post(`${import.meta.env.VITE_API_URL}/api/sensor/emergency`, {}, config);
                alert("Acil durum sinyali gönderildi!");
            } catch (error) {
                console.error("Emergency alert failed", error);
                alert("Sinyal gönderilemedi!");
            }
    };

    const isEmergency = currentStatus !== 'Normal';
    const statusColor = isEmergency ? theme.palette.error.main : theme.palette.success.main;
    const StatusIcon = isEmergency ? WarningIcon : CheckCircleIcon;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'text.secondary' }}>
                Hoşgeldin, {user?.name?.split(' ')[0]} 👋
            </Typography>



                {/* Acil Durum Butonu */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Button
                        variant="contained"
                        color="error"
                        size="large"
                        fullWidth
                        startIcon={<ErrorOutlineIcon sx={{ fontSize: 40 }} />}
                        onClick={handleEmergency}
                        sx={{ 
                            py: 4, 
                            borderRadius: 4, 
                            fontSize: '1.5rem', 
                            fontWeight: 'bold',
                            boxShadow: '0 8px 20px rgba(211, 47, 47, 0.4)',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                transition: 'all 0.2s ease-in-out'
                            }
                        }}
                    >
                        ACİL DURUM BUTONU
                    </Button>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                        Bu butona basıldığında kayıtlı kişilerinize ve sisteme acil durum uyarısı gönderilir.
                    </Typography>
                </Grid>

            {user.deviceId ? (
                <Grid container spacing={3} width="100%">
                {/* Durum Kartı */}
                <Grid item xs={12} sm={6} md={6} sx={{ width: '100%' }}>
                    <Paper 
                        elevation={4}
                        sx={{ 
                            p: 3, 
                            height: 200, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between',
                            bgcolor: statusColor, 
                            color: '#fff',
                            borderRadius: 4,
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>DURUM</Typography>
                            <StatusIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                        </Box>
                        
                        <Box>
                            <Typography variant="h4" fontWeight="bold">
                                {currentStatus === 'Normal' ? 'GÜVENLİ' : 'ACİL DURUM!'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                {currentStatus}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Nabız Kartı */}
                <Grid item xs={12} sm={6} md={6} sx={{ width: '100%' }}>
                    <Paper 
                        elevation={2}
                        sx={{ 
                            p: 3, 
                            height: 200, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between',
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #fff 0%, #f5f7fa 100%)',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6" color="text.secondary">NABIZ</Typography>
                            <FavoriteIcon color="error" sx={{ fontSize: 40 }} />
                        </Box>
                        
                        <Box>
                            <Typography variant="h2" fontWeight="bold" color="text.primary">
                                {currentHeartRate}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                Vuruş / Dakika (BPM)
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            ):(
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'text.secondary' }}>
<a href="/settings"> Ayarlar </a>
sayfasından Cihazınızın benzersiz kimliğini (ID) buraya girerek eşleştirme yapabilirsiniz.
                    </Typography>
                </Grid>
            )}
        </Container>
    );
};

export default Dashboard;
