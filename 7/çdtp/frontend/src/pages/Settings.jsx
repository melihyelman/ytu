import React, { useState, useContext, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert, Grid, Divider, List, ListItem, ListItemText, IconButton, Link } from '@mui/material';
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import WarningIcon from '@mui/icons-material/Warning';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TelegramIcon from '@mui/icons-material/Telegram';
import AuthContext from '../context/AuthContext';

const Settings = () => {
    const { user, updateContacts, updateSettings } = useContext(AuthContext);
    const [deviceId, setDeviceId] = useState('');
    const [message, setMessage] = useState(null);
    const [contacts, setContacts] = useState([]);

    // Contact Form State
    const [name, setName] = useState('');
    const [telegramChatId, setTelegramChatId] = useState('');

    // Threshold Settings State
    const [heartRateMin, setHeartRateMin] = useState(40);
    const [heartRateMax, setHeartRateMax] = useState(200);
    const [inactivityThreshold, setInactivityThreshold] = useState(300);
    const [settingsMessage, setSettingsMessage] = useState(null);

    useEffect(() => {
        if (user) {
            if (user.deviceId) setDeviceId(user.deviceId);
            if (user.emergencyContacts) setContacts(user.emergencyContacts);
            if (user.heartRateThresholdMin !== undefined) setHeartRateMin(user.heartRateThresholdMin);
            if (user.heartRateThresholdMax !== undefined) setHeartRateMax(user.heartRateThresholdMax);
            if (user.inactivityThreshold !== undefined) setInactivityThreshold(user.inactivityThreshold);
        }
    }, [user]);

    const handleSaveDeviceId = async (e) => {
        e.preventDefault();
        try {
            await updateContacts(contacts, deviceId);
            setMessage({ type: 'success', text: 'Cihaz ID kaydedildi.' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Güncelleme başarısız.' });
        }
    };

    // Contacts Handlers
    const handleAddContact = async () => {
        if (!name || !telegramChatId) {
            alert("Lütfen isim ve Telegram Chat ID girin.");
            return;
        }
        const newContact = { name, telegramChatId };
        const newContactsList = [...contacts, newContact];
        
        // Update via context
        await updateContacts(newContactsList, deviceId); 
        setContacts(newContactsList);
        setName('');
        setTelegramChatId('');
    };

    const handleDeleteContact = async (index) => {
        const newContactsList = contacts.filter((_, i) => i !== index);
        await updateContacts(newContactsList, deviceId);
        setContacts(newContactsList);
    };

    const handleSaveThresholds = async (e) => {
        e.preventDefault();
        setSettingsMessage(null);

        // Validasyon
        if (heartRateMin >= heartRateMax) {
            setSettingsMessage({ type: 'error', text: 'Minimum kalp ritmi maksimumdan küçük olmalıdır.' });
            return;
        }
        if (heartRateMin < 0 || heartRateMax < 0 || inactivityThreshold < 0) {
            setSettingsMessage({ type: 'error', text: 'Eşik değerleri negatif olamaz.' });
            return;
        }

        try {
            const success = await updateSettings({
                heartRateThresholdMin: heartRateMin,
                heartRateThresholdMax: heartRateMax,
                inactivityThreshold: inactivityThreshold
            });
            
            if (success) {
                setSettingsMessage({ type: 'success', text: 'Eşik değerleri başarıyla kaydedildi.' });
            } else {
                setSettingsMessage({ type: 'error', text: 'Eşik değerleri kaydedilemedi.' });
            }
        } catch (error) {
            setSettingsMessage({ type: 'error', text: 'Bir hata oluştu.' });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
             <Typography variant="h4" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 4 }}>
                Ayarlar
            </Typography>

            <Grid container spacing={3}>
                {/* Cihaz Ayarları - Sol Taraf */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: '100%', boxSizing: 'border-box' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={3}>
                            <SettingsRemoteIcon color="primary" fontSize="large" />
                            <Typography variant="h6" fontWeight="bold">
                                Cihaz Eşleştirme
                            </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                            ESP32 cihazınızın benzersiz kimliğini (ID) buraya girerek eşleştirme yapabilirsiniz.
                        </Typography>

                        {message && (
                            <Alert severity={message.type} sx={{ mb: 3 }}>
                                {message.text}
                            </Alert>
                        )}

                        <Box component="form">
                            <TextField 
                                label="Cihaz ID (Örn: ESP32_001)" 
                                fullWidth 
                                variant="outlined" 
                                value={deviceId}
                                onChange={(e) => setDeviceId(e.target.value)}
                                sx={{ mb: 3 }}
                                helperText="Cihazınızın üzerindeki etikette yazan ID."
                            />

                            <Button 
                                variant="contained" 
                                size="large" 
                                fullWidth
                                startIcon={<SaveIcon />}
                                onClick={handleSaveDeviceId} // We'll combine logic in AuthContext
                                sx={{ py: 1.5 }}
                            >
                                Cihaz ID Kaydet
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Kişiler Ayarları - Sağ Taraf */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: '100%', boxSizing: 'border-box' }}>
                         <Box display="flex" alignItems="center" gap={1} mb={3}>
                            <PersonIcon color="primary" fontSize="large" />
                            <Typography variant="h6" fontWeight="bold">
                                Acil Durum Kişileri
                            </Typography>
                        </Box>
                        
                        {/* Yeni Kişi Ekle */}
                         <Box sx={{ mb: 4, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #eee' }}>
                            <Typography variant="subtitle2" gutterBottom fontWeight="bold">Yeni Kişi Ekle</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        label="Ad Soyad" 
                                        value={name} onChange={(e) => setName(e.target.value)} 
                                        size="small" fullWidth 
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        label="Telegram Chat ID" 
                                        value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value)} 
                                        size="small" fullWidth 
                                        placeholder="Örn: 123456789"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button 
                                        variant="contained" 
                                        startIcon={<AddCircleIcon />} 
                                        onClick={handleAddContact}
                                        fullWidth
                                        size="small"
                                    >
                                        Listeye Ekle
                                    </Button>
                                </Grid>
                                
                            </Grid>
                        </Box>

                        <Divider sx={{ mb: 2 }} />
                        <Grid item xs={12}>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Telegram Chat ID Nasıl Öğrenilir?
                                        </Typography>
                                        <Box component="ol" sx={{ margin: 0, paddingLeft: 2.5, '& li': { mb: 1 } }}>
                                            <Typography component="li" variant="body2">
                                                Telegram'da{' '}
                                                <Link href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer">
                                                    @userinfobot
                                                </Link>
                                                {' '}ile konuşun ve <strong>/start</strong> mesajı gönderin
                                            </Typography>
                                            <Typography component="li" variant="body2">
                                                Bot size Chat ID'nizi verecektir
                                            </Typography>
                                            <Typography component="li" variant="body2">
                                                Bu ID'yi yukarıdaki alana girin
                                            </Typography>
                                        </Box>
                                    </Alert>
                                </Grid>

                        <Grid item xs={12}>
                            <Alert severity="warning" icon={<TelegramIcon />} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                    🚨 Önemli: Botu Etkinleştirin!
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Telegram bildirimlerini alabilmek için Chat ID'nizi girdikten sonra aşağıdaki botu etkinleştirmeniz <strong>zorunludur</strong>:
                                </Typography>
                                <Box component="ol" sx={{ margin: 0, paddingLeft: 2.5, '& li': { mb: 1 } }}>
                                    <Typography component="li" variant="body2">
                                        <Link href="https://t.me/cdtp_melih_bot" target="_blank" rel="noopener noreferrer">
                                            @cdtp_melih_bot
                                        </Link>
                                        {' '}botuna tıklayarak Telegram'da açın
                                    </Typography>
                                    <Typography component="li" variant="body2">
                                        Bota <strong>/start</strong> komutunu gönderin
                                    </Typography>
                                    <Typography component="li" variant="body2">
                                        Bu adımı yapmadan bildirim alamazsınız!
                                    </Typography>
                                </Box>
                            </Alert>
                        </Grid>

                        <Divider sx={{ mb: 2 }} />

                        {/* Liste */}
                        <List >
                            {contacts.map((contact, index) => (
                                <ListItem 
                                    key={index}
                                    sx={{ 
                                        bgcolor: '#fff', 
                                        borderRadius: 1, 
                                        mb: 1,
                                        border: '1px solid #eee'
                                    }}
                                    secondaryAction={
                                        <IconButton edge="end" color="error" onClick={() => handleDeleteContact(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText 
                                        primary={<Typography fontWeight="medium">{contact.name}</Typography>} 
                                        secondary={
                                            <Box component="span" sx={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem', gap: 0.5 }}>
                                                {contact.telegramChatId && <span>💬 Telegram ID: {contact.telegramChatId}</span>}
                                            </Box>
                                        } 
                                    />
                                </ListItem>
                            ))}
                            {contacts.length === 0 && (
                                <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 2 }}>
                                    Liste boş.
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Eşik Değerleri Ayarları */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={3}>
                            <WarningIcon color="primary" fontSize="large" />
                            <Typography variant="h6" fontWeight="bold">
                                Eşik Değerleri
                            </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                            Sistemin acil durum uyarısı göndermesi için kullanılacak eşik değerlerini buradan ayarlayabilirsiniz.
                        </Typography>

                        {settingsMessage && (
                            <Alert severity={settingsMessage.type} sx={{ mb: 3 }}>
                                {settingsMessage.text}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSaveThresholds}>
                            <Grid container spacing={3}>
                                {/* Kalp Ritmi Minimum */}
                                <Grid item xs={12} md={4}>
                                    <TextField 
                                        label="Min Kalp Ritmi" 
                                        type="number"
                                        fullWidth 
                                        variant="outlined" 
                                        value={heartRateMin}
                                        onChange={(e) => setHeartRateMin(parseInt(e.target.value) || 0)}
                                        helperText="Kalp ritmi bu değerin altına düştüğünde uyarı gönderilir."
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>

                                {/* Kalp Ritmi Maksimum */}
                                <Grid item xs={12} md={4}>
                                    <TextField 
                                        label="Max Kalp Ritmi" 
                                        type="number"
                                        fullWidth 
                                        variant="outlined" 
                                        value={heartRateMax}
                                        onChange={(e) => setHeartRateMax(parseInt(e.target.value) || 0)}
                                        helperText="Kalp ritmi bu değerin üstüne çıktığında uyarı gönderilir."
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>

                                {/* Aktivitesizlik Eşiği */}
                                <Grid item xs={12} md={4}>
                                    <TextField 
                                        label="Aktivitesizlik Süresi" 
                                        type="number"
                                        fullWidth 
                                        variant="outlined" 
                                        value={inactivityThreshold}
                                        onChange={(e) => setInactivityThreshold(parseInt(e.target.value) || 0)}
                                        helperText="Bu süre boyunca hareket algılanmazsa uyarı gönderilir."
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3 }}>
                                <Button 
                                    type="submit"
                                    variant="contained" 
                                    size="large" 
                                    fullWidth
                                    startIcon={<SaveIcon />}
                                    sx={{ py: 1.5 }}
                                >
                                    Eşik Değerlerini Kaydet
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Settings;
