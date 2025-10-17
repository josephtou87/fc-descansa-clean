const sgMail = require('@sendgrid/mail');

class EmailService {
    constructor() {
        this.apiKey = process.env.SENDGRID_API_KEY;
        this.fromEmail = process.env.FROM_EMAIL || 'noreply@fcdescansa.com';
        this.fromName = process.env.FROM_NAME || 'FC Descansa';
        
        if (this.apiKey && this.apiKey.startsWith('SG.')) {
            sgMail.setApiKey(this.apiKey);
            this.isConfigured = true;
            console.log('✅ SendGrid email service configured');
        } else {
            this.isConfigured = false;
            console.log('ℹ️  SendGrid not configured. Email notifications disabled (optional)');
        }
    }

    async sendEmail(to, subject, text, html = null) {
        try {
            if (!this.apiKey) {
                console.log('📧 Mock email sent:', { to, subject, text });
                return { success: true, message: 'Mock email sent' };
            }

            const msg = {
                to,
                from: {
                    email: this.fromEmail,
                    name: this.fromName
                },
                subject,
                text,
                html: html || text
            };

            await sgMail.send(msg);
            console.log('📧 Email sent successfully to:', to);
            return { success: true, message: 'Email sent successfully' };
        } catch (error) {
            console.error('❌ Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    async sendWelcomeEmail(playerEmail, playerName) {
        const subject = '¡Bienvenido a FC Descansa!';
        const text = `Hola ${playerName},\n\n¡Bienvenido al equipo FC Descansa!\n\nTu registro ha sido exitoso. Te mantendremos informado sobre próximos partidos y eventos.\n\n¡Nos vemos en la cancha!\n\nFC Descansa`;
        
        return await this.sendEmail(playerEmail, subject, text);
    }

    async sendMatchNotification(playerEmail, playerName, matchInfo) {
        const subject = `Partido FC Descansa - ${matchInfo.date}`;
        const text = `Hola ${playerName},\n\nTe recordamos que tienes un partido:\n\n📅 Fecha: ${matchInfo.date}\n⏰ Hora: ${matchInfo.time}\n🏟️ Lugar: ${matchInfo.venue}\n\n¡Sé puntual y dale todo!\n\nFC Descansa`;
        
        return await this.sendEmail(playerEmail, subject, text);
    }

    async sendMatchReminder(playerEmail, playerName, matchInfo) {
        const subject = 'Recordatorio: Partido en 1 hora';
        const text = `Hola ${playerName},\n\n¡Recordatorio! Tu partido es en 1 hora:\n\n📅 Fecha: ${matchInfo.date}\n⏰ Hora: ${matchInfo.time}\n🏟️ Lugar: ${matchInfo.venue}\n\n¡Apúrate y dale todo!\n\nFC Descansa`;
        
        return await this.sendEmail(playerEmail, subject, text);
    }
}

module.exports = new EmailService();
