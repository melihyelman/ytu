const https = require('https');

const TELEGRAM_BOT_TOKEN = '8062648116:AAGCwG6Ur_xJD8CcIL_H6zWcMkFZ7tv6CD8';
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

const sendTelegramMessage = async (chatId, message) => {
    if (!TELEGRAM_BOT_TOKEN) {
        throw new Error('TELEGRAM_BOT_TOKEN not configured');
    }

    const url = `${TELEGRAM_API_URL}${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const data = JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
    });

    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(responseData));
                } else {
                    reject(new Error(`Telegram API error: ${res.statusCode} - ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
};

const sendEmergencyAlert = async (user, alertType, data) => {
    const message = `
🚨 ACİL DURUM UYARISI! 🚨

Kullanıcı: ${user.name}
Durum: ${alertType}
Zaman: ${new Date().toLocaleString('tr-TR')}

Nabız: ${data.heartRate || 'N/A'} BPM
Konum/Durum Bilgisi: ${data.motionStatus}

⚠️ Lütfen kullanıcı ile iletişime geçin!
    `.trim();

    if (!user.emergencyContacts || user.emergencyContacts.length === 0) {
        console.log('⚠️  No emergency contacts found for user:', user.name);
        return;
    }

    if (!TELEGRAM_BOT_TOKEN) {
        console.error('❌ Telegram bot not configured. Please set TELEGRAM_BOT_TOKEN in .env');
        return;
    }

    // Tüm Telegram mesajlarını paralel olarak gönder
    const notificationPromises = [];

    user.emergencyContacts.forEach((contact) => {
        // Telegram mesajı gönder
        if (contact.telegramChatId) {
            notificationPromises.push(
                sendTelegramMessage(contact.telegramChatId, message)
                .then(() => console.log(`✅ Telegram sent to ${contact.telegramChatId}`))
                .catch((error) => console.error(`❌ Failed to send Telegram to ${contact.telegramChatId}:`, error.message))
            );
        } else {
            console.warn(`⚠️  Contact ${contact.name} has no Telegram Chat ID`);
        }
    });

    // Tüm bildirimleri bekle
    await Promise.allSettled(notificationPromises);
    console.log(`📤 Emergency alert notifications sent for user: ${user.name}`);
};

module.exports = { sendEmergencyAlert };

