/**
 * Script para configurar variables de entorno en Vercel
 * Este script te guía paso a paso para configurar las variables de entorno
 */

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setupVercelEnvironment() {
    console.log('🚀 Configuración de Variables de Entorno para Vercel');
    console.log('================================================\n');

    console.log('Este script te ayudará a configurar las variables de entorno necesarias para WhatsApp y Email en Vercel.\n');

    // Twilio Configuration
    console.log('📱 CONFIGURACIÓN DE TWILIO (WhatsApp)');
    console.log('=====================================');
    console.log('1. Ve a https://console.twilio.com/');
    console.log('2. Encuentra tu Account SID y Auth Token en el dashboard');
    console.log('3. Para WhatsApp, activa el sandbox en Messaging > Try it out > Send a WhatsApp message\n');

    const twilioAccountSid = await question('Ingresa tu TWILIO_ACCOUNT_SID (comienza con AC): ');
    const twilioAuthToken = await question('Ingresa tu TWILIO_AUTH_TOKEN: ');
    const twilioWhatsappNumber = await question('Ingresa tu TWILIO_WHATSAPP_NUMBER (ej: +14155238886): ');

    console.log('\n📧 CONFIGURACIÓN DE SENDGRID (Email)');
    console.log('====================================');
    console.log('1. Ve a https://app.sendgrid.com/');
    console.log('2. Ve a Settings > API Keys');
    console.log('3. Crea una nueva API Key con permisos de "Mail Send"\n');

    const sendgridApiKey = await question('Ingresa tu SENDGRID_API_KEY (comienza con SG.): ');
    const fromEmail = await question('Ingresa tu FROM_EMAIL (ej: noreply@fcdescansa.com): ');
    const fromName = await question('Ingresa tu FROM_NAME (ej: FC Descansa): ');

    console.log('\n📋 RESUMEN DE CONFIGURACIÓN');
    console.log('============================');
    console.log('Variables de entorno a configurar en Vercel:\n');

    console.log('TWILIO_ACCOUNT_SID=' + twilioAccountSid);
    console.log('TWILIO_AUTH_TOKEN=' + twilioAuthToken);
    console.log('TWILIO_WHATSAPP_NUMBER=' + twilioWhatsappNumber);
    console.log('SENDGRID_API_KEY=' + sendgridApiKey);
    console.log('FROM_EMAIL=' + fromEmail);
    console.log('FROM_NAME=' + fromName);

    console.log('\n🔧 PASOS PARA CONFIGURAR EN VERCEL:');
    console.log('===================================');
    console.log('1. Ve a https://vercel.com/dashboard');
    console.log('2. Selecciona tu proyecto "fc-descansa-website"');
    console.log('3. Ve a Settings > Environment Variables');
    console.log('4. Agrega cada variable de entorno con los valores de arriba');
    console.log('5. Asegúrate de seleccionar "Production" para todas');
    console.log('6. Haz clic en "Save" para cada variable');
    console.log('7. Ve a Deployments y haz "Redeploy" del último deployment');

    console.log('\n🧪 PRUEBAS:');
    console.log('===========');
    console.log('Después de configurar, puedes probar con:');
    console.log('- GET /api/notifications/test (sistema completo)');
    console.log('- GET /api/notifications/test-sendgrid (solo email)');
    console.log('- GET /api/notifications/test-twilio (solo WhatsApp)');
    console.log('- POST /api/notifications/test-email (email personalizado)');
    console.log('- POST /api/notifications/test-whatsapp (WhatsApp personalizado)');

    console.log('\n📚 DOCUMENTACIÓN:');
    console.log('=================');
    console.log('Revisa VERCEL_PRODUCTION_SETUP.md para más detalles');

    const continueSetup = await question('\n¿Quieres que genere un archivo .env.local para pruebas locales? (y/n): ');
    
    if (continueSetup.toLowerCase() === 'y' || continueSetup.toLowerCase() === 'yes') {
        const envContent = `# Variables de entorno para desarrollo local
# NO subir este archivo a Git

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=${twilioAccountSid}
TWILIO_AUTH_TOKEN=${twilioAuthToken}
TWILIO_WHATSAPP_NUMBER=${twilioWhatsappNumber}

# SendGrid (Email)
SENDGRID_API_KEY=${sendgridApiKey}
FROM_EMAIL=${fromEmail}
FROM_NAME=${fromName}

# Base de datos (ya configurada)
DATABASE_URL=tu_database_url_aqui
`;

        const fs = require('fs');
        fs.writeFileSync('.env.local', envContent);
        console.log('\n✅ Archivo .env.local creado para pruebas locales');
        console.log('⚠️  Recuerda agregar .env.local a tu .gitignore');
    }

    console.log('\n🎉 ¡Configuración completada!');
    console.log('Ahora puedes desplegar tu aplicación y las notificaciones funcionarán en producción.');

    rl.close();
}

// Ejecutar el script
if (require.main === module) {
    setupVercelEnvironment().catch(console.error);
}

module.exports = { setupVercelEnvironment };


