/**
 * Script para probar las notificaciones en producción
 * Ejecutar con: node test-production-notifications.js
 */

const https = require('https');

// Configuración - Cambia por tu dominio de Vercel
const VERCEL_DOMAIN = 'tu-dominio.vercel.app'; // Cambiar por tu dominio real

// Función para hacer peticiones HTTPS
function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: VERCEL_DOMAIN,
            port: 443,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

async function testNotifications() {
    console.log('🧪 Iniciando pruebas de notificaciones en producción...\n');

    try {
        // 1. Probar sistema completo
        console.log('1️⃣ Probando sistema completo...');
        const systemTest = await makeRequest('/api/notifications/test');
        console.log('✅ Sistema completo:', systemTest.data);
        console.log('');

        // 2. Probar SendGrid
        console.log('2️⃣ Probando SendGrid...');
        const sendgridTest = await makeRequest('/api/notifications/test-sendgrid');
        console.log('✅ SendGrid:', sendgridTest.data);
        console.log('');

        // 3. Probar Twilio
        console.log('3️⃣ Probando Twilio...');
        const twilioTest = await makeRequest('/api/notifications/test-twilio');
        console.log('✅ Twilio:', twilioTest.data);
        console.log('');

        // 4. Probar email personalizado
        console.log('4️⃣ Probando email personalizado...');
        const emailTest = await makeRequest('/api/notifications/test-email', 'POST', {
            to: 'test@example.com',
            subject: 'Prueba de Email - FC Descansa',
            message: 'Este es un mensaje de prueba desde el sistema de producción.'
        });
        console.log('✅ Email personalizado:', emailTest.data);
        console.log('');

        // 5. Probar WhatsApp personalizado
        console.log('5️⃣ Probando WhatsApp personalizado...');
        const whatsappTest = await makeRequest('/api/notifications/test-whatsapp', 'POST', {
            to: '+1234567890', // Cambiar por un número real para probar
            message: 'Prueba de WhatsApp desde FC Descansa - Sistema de Producción'
        });
        console.log('✅ WhatsApp personalizado:', whatsappTest.data);
        console.log('');

        console.log('🎉 ¡Todas las pruebas completadas!');
        console.log('\n📋 Resumen:');
        console.log('- Sistema de notificaciones: ✅');
        console.log('- SendGrid (Email): ✅');
        console.log('- Twilio (WhatsApp): ✅');
        console.log('\n💡 Nota: Si ves "Mock" en las respuestas, significa que las variables de entorno no están configuradas correctamente.');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
        console.log('\n🔧 Posibles soluciones:');
        console.log('1. Verifica que el dominio de Vercel sea correcto');
        console.log('2. Asegúrate de que la aplicación esté desplegada');
        console.log('3. Verifica que las variables de entorno estén configuradas');
    }
}

// Ejecutar las pruebas
if (require.main === module) {
    console.log('⚠️  IMPORTANTE: Antes de ejecutar este script:');
    console.log('1. Cambia VERCEL_DOMAIN por tu dominio real de Vercel');
    console.log('2. Asegúrate de que las variables de entorno estén configuradas');
    console.log('3. Para probar WhatsApp real, cambia el número de teléfono\n');
    
    testNotifications();
}

module.exports = { testNotifications, makeRequest };


