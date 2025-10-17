const twilio = require('twilio');

class WhatsAppService {
    constructor() {
        this.accountSid = process.env.TWILIO_ACCOUNT_SID;
        this.authToken = process.env.TWILIO_AUTH_TOKEN;
        this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
        
        if (this.accountSid && this.authToken && this.accountSid.startsWith('AC')) {
            this.client = twilio(this.accountSid, this.authToken);
            this.isConfigured = true;
            console.log('✅ Twilio WhatsApp service configured');
        } else {
            this.client = null;
            this.isConfigured = false;
            console.log('ℹ️  Twilio not configured. WhatsApp notifications disabled (optional)');
        }
    }

    async sendMessage(to, message) {
        try {
            if (!this.client) {
                console.log('📱 Mock WhatsApp message sent:', { to, message });
                return { success: true, message: 'Mock WhatsApp message sent' };
            }

            const result = await this.client.messages.create({
                body: message,
                from: `whatsapp:${this.whatsappNumber}`,
                to: `whatsapp:${to}`
            });

            console.log('📱 WhatsApp message sent successfully:', result.sid);
            return { success: true, messageId: result.sid };
        } catch (error) {
            console.error('❌ Error sending WhatsApp message:', error);
            return { success: false, error: error.message };
        }
    }

    async sendWelcomeMessage(playerWhatsApp, playerName) {
        const message = `¡Hola ${playerName}! 🎉\n\n¡Bienvenido al equipo FC Descansa!\n\nTu registro ha sido exitoso. Te mantendremos informado sobre próximos partidos y eventos.\n\n¡Nos vemos en la cancha! ⚽\n\nFC Descansa`;
        
        return await this.sendMessage(playerWhatsApp, message);
    }

    async sendMatchNotification(playerWhatsApp, playerName, matchInfo) {
        const message = `Hola ${playerName}! ⚽\n\nTe recordamos que tienes un partido:\n\n📅 Fecha: ${matchInfo.date}\n⏰ Hora: ${matchInfo.time}\n🏟️ Lugar: ${matchInfo.venue}\n\n¿Vas a ir al partido? Confirma con "SÍ" o "NO"\n\n¡Sé puntual y dale todo! 💪`;
        
        return await this.sendMessage(playerWhatsApp, message);
    }

    async sendMatchReminder(playerWhatsApp, playerName, matchInfo) {
        const message = `¡Recordatorio! ⏰\n\nHola ${playerName}, tu partido es en 1 hora:\n\n📅 Fecha: ${matchInfo.date}\n⏰ Hora: ${matchInfo.time}\n🏟️ Lugar: ${matchInfo.venue}\n\n¡Apúrate y dale todo! ⚽💪`;
        
        return await this.sendMessage(playerWhatsApp, message);
    }

    async sendConfirmationRequest(playerWhatsApp, playerName, matchInfo) {
        const message = `Hola ${playerName}! ⚽\n\nTienes un partido:\n\n📅 Fecha: ${matchInfo.date}\n⏰ Hora: ${matchInfo.time}\n🏟️ Lugar: ${matchInfo.venue}\n\n¿Vas a ir al partido?\n\nResponde:\n✅ SÍ - Para confirmar asistencia\n❌ NO - Para cancelar\n\n¡Esperamos tu respuesta!`;
        
        return await this.sendMessage(playerWhatsApp, message);
    }
}

module.exports = new WhatsAppService();
