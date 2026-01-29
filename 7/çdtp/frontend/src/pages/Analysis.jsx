import React, { useState, useEffect, useContext } from 'react';
import { 
    Container, 
    Typography, 
    Paper, 
    Grid, 
    Box, 
    Card, 
    CardContent,
    CircularProgress,
    Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Analysis = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/sensor/analytics`, config);
                setAnalytics(data);
            } catch (err) {
                console.error('Error fetching analytics', err);
                setError('Analiz verileri yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAnalytics();
        }
    }, [user]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!analytics) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="info">Henüz analiz verisi bulunmamaktadır.</Alert>
            </Container>
        );
    }

    const { heartRateAnalysis, emergencyStats } = analytics;

    // Acil durum türlerini Türkçe'ye çevir
    const getEmergencyTypeLabel = (type) => {
        const labels = {
            'Fall Detected': 'Düşme Algılandı',
            'Manual Alarm': 'Manuel Alarm',
            'Abnormal Heart Rate': 'Anormal Kalp Ritmi',
            'Long Inactivity': 'Uzun Süreli Aktivitesizlik',
            'Inactivity': 'Aktivitesizlik'
        };
        return labels[type] || type;
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 4 }}>
                Detaylı Analizler
            </Typography>

            <Grid container spacing={12}>
                {/* Kalp Ritmi Analizi */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={3}>
                            <FavoriteIcon color="error" fontSize="large" />
                            <Typography variant="h6" fontWeight="bold">
                                Kalp Ritmi Analizi
                            </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                            Son 30 günün kalp ritmi verilerine göre analiz
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Card variant="outlined" sx={{ textAlign: 'center', bgcolor: '#f5f5f5' }}>
                                    <CardContent>
                                        <Typography variant="h4" fontWeight="bold" color="primary">
                                            {heartRateAnalysis.average}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ortalama (BPM)
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined" sx={{ textAlign: 'center', bgcolor: '#f5f5f5' }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                            <TrendingUpIcon color="error" />
                                            <Typography variant="h4" fontWeight="bold" color="error.main">
                                                {heartRateAnalysis.max}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Maksimum (BPM)
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined" sx={{ textAlign: 'center', bgcolor: '#f5f5f5' }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                            <TrendingDownIcon color="primary" />
                                            <Typography variant="h4" fontWeight="bold" color="primary.main">
                                                {heartRateAnalysis.min}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Minimum (BPM)
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card variant="outlined" sx={{ textAlign: 'center', bgcolor: '#fff3cd' }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                            <WarningIcon color="warning" />
                                            <Typography variant="h4" fontWeight="bold" color="warning.main">
                                                {heartRateAnalysis.thresholdExceededCount}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Eşik Aşımı
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Toplam Ölçüm:</strong> {heartRateAnalysis.totalReadings} kayıt
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Acil Durum İstatistikleri */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={3}>
                            <WarningIcon color="error" fontSize="large" />
                            <Typography variant="h6" fontWeight="bold">
                                Acil Durum İstatistikleri
                            </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                            Son 30 gün içindeki acil durum kayıtları
                        </Typography>

                        <Card variant="outlined" sx={{ mb: 3, bgcolor: '#ffebee', borderColor: '#ef5350' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                                    <WarningIcon sx={{ fontSize: 48, color: '#d32f2f' }} />
                                    <Box>
                                        <Typography variant="h3" fontWeight="bold" color="error.main">
                                            {emergencyStats.totalEmergencies}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Toplam Acil Durum
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        {emergencyStats.totalEmergencies > 0 ? (
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Durum Türlerine Göre Dağılım:
                                </Typography>
                                {Object.entries(emergencyStats.byType).map(([type, count]) => (
                                    <Box 
                                        key={type}
                                        sx={{ 
                                            mb: 2, 
                                            p: 2, 
                                            bgcolor: '#f5f5f5', 
                                            borderRadius: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Typography variant="body1">
                                            {getEmergencyTypeLabel(type)}
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold" color="error.main">
                                            {count}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <AccessTimeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    Son 30 günde acil durum kaydı bulunmamaktadır
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Analysis;

