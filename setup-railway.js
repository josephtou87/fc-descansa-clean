#!/usr/bin/env node

/**
 * 🚂 Setup Automático para Railway
 * 
 * Este script te guía paso a paso para configurar Railway
 * Ejecuta: node setup-railway.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function colorLog(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function main() {
    console.clear();
    
    colorLog('🚂 CONFIGURACIÓN AUTOMÁTICA DE RAILWAY', 'cyan');
    colorLog('=====================================\n', 'cyan');
    
    colorLog('Este script te ayudará a configurar Railway paso a paso.\n', 'blue');
    
    // Paso 1: Verificar estructura del proyecto
    colorLog('📁 PASO 1: Verificando estructura del proyecto...', 'yellow');
    
    const backendExists = fs.existsSync('./backend');
    const packageExists = fs.existsSync('./backend/package.json');
    
    if (!backendExists) {
        colorLog('❌ No se encontró la carpeta backend/', 'red');
        colorLog('   Asegúrate de ejecutar este script desde la raíz del proyecto', 'red');
        process.exit(1);
    }
    
    if (!packageExists) {
        colorLog('❌ No se encontró backend/package.json', 'red');
        colorLog('   Ejecuta: cd backend && npm init -y', 'red');
        process.exit(1);
    }
    
    colorLog('✅ Estructura del proyecto verificada\n', 'green');
    
    // Paso 2: Verificar si ya existe .env
    colorLog('🔧 PASO 2: Verificando configuración...', 'yellow');
    
    const envPath = './backend/.env';
    const envExists = fs.existsSync(envPath);
    
    if (envExists) {
        colorLog('⚠️  Ya existe un archivo .env', 'yellow');
        const overwrite = await askQuestion('¿Quieres sobrescribirlo? (y/N): ');
        
        if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
            colorLog('✅ Manteniendo configuración existente\n', 'green');
        } else {
            fs.unlinkSync(envPath);
            colorLog('🗑️  Archivo .env anterior eliminado\n', 'yellow');
        }
    }
    
    // Paso 3: Obtener DATABASE_URL
    colorLog('🗄️  PASO 3: Configuración de Railway Database', 'yellow');
    colorLog('', 'reset');
    colorLog('Para obtener tu DATABASE_URL:', 'blue');
    colorLog('1. Ve a https://railway.app/', 'blue');
    colorLog('2. Crea un nuevo proyecto', 'blue');
    colorLog('3. Selecciona "Provision PostgreSQL"', 'blue');
    colorLog('4. Ve a Variables y copia DATABASE_URL', 'blue');
    colorLog('', 'reset');
    
    let databaseUrl = '';
    while (!databaseUrl || !databaseUrl.includes('postgresql://')) {
        databaseUrl = await askQuestion('Pega tu DATABASE_URL de Railway: ');
        
        if (!databaseUrl || !databaseUrl.includes('postgresql://')) {
            colorLog('❌ URL inválida. Debe empezar con postgresql://', 'red');
        }
    }
    
    colorLog('✅ DATABASE_URL configurada\n', 'green');
    
    // Paso 4: Configurar otras variables
    colorLog('🔐 PASO 4: Configuración adicional', 'yellow');
    
    const jwtSecret = await askQuestion('JWT_SECRET (presiona Enter para usar uno generado): ') || 
                     `fc_descansa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const frontendUrl = await askQuestion('Frontend URL (presiona Enter para localhost:3000): ') || 
                       'http://localhost:3000';
    
    // Paso 5: Crear archivo .env
    colorLog('\n📝 PASO 5: Creando archivo .env...', 'yellow');
    
    const envContent = `# Database Configuration - Railway
DATABASE_URL=${databaseUrl}

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d

# SendGrid Email Service (opcional)
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@fcdescansa.com
FROM_NAME=FC Descansa

# Twilio WhatsApp Service (opcional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_NUMBER=+1234567890

# Frontend URL
FRONTEND_URL=${frontendUrl}

# Server Configuration
NODE_ENV=development
PORT=3000
`;
    
    fs.writeFileSync(envPath, envContent);
    colorLog('✅ Archivo .env creado en backend/.env\n', 'green');
    
    // Paso 6: Verificar .gitignore
    colorLog('🔒 PASO 6: Verificando .gitignore...', 'yellow');
    
    const gitignorePath = './.gitignore';
    let gitignoreContent = '';
    
    if (fs.existsSync(gitignorePath)) {
        gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }
    
    if (!gitignoreContent.includes('.env')) {
        gitignoreContent += '\n# Environment variables\n.env\n.env.local\n.env.*.local\n';
        fs.writeFileSync(gitignorePath, gitignoreContent);
        colorLog('✅ .gitignore actualizado para proteger .env', 'green');
    } else {
        colorLog('✅ .gitignore ya protege archivos .env', 'green');
    }
    
    // Paso 7: Instalar dependencias
    colorLog('\n📦 PASO 7: ¿Instalar dependencias?', 'yellow');
    const installDeps = await askQuestion('¿Quieres instalar las dependencias de Node.js? (Y/n): ');
    
    if (installDeps.toLowerCase() !== 'n' && installDeps.toLowerCase() !== 'no') {
        colorLog('📦 Instalando dependencias...', 'blue');
        
        const { spawn } = require('child_process');
        
        const npmInstall = spawn('npm', ['install'], {
            cwd: './backend',
            stdio: 'inherit'
        });
        
        await new Promise((resolve) => {
            npmInstall.on('close', resolve);
        });
        
        colorLog('✅ Dependencias instaladas\n', 'green');
    }
    
    // Paso 8: Probar conexión
    colorLog('🧪 PASO 8: ¿Probar conexión a Railway?', 'yellow');
    const testConnection = await askQuestion('¿Quieres probar la conexión ahora? (Y/n): ');
    
    if (testConnection.toLowerCase() !== 'n' && testConnection.toLowerCase() !== 'no') {
        colorLog('🔍 Probando conexión...', 'blue');
        
        try {
            // Cambiar al directorio backend para la prueba
            process.chdir('./backend');
            
            const { testRailwayConnection } = require('./test-connection');
            const success = await testRailwayConnection();
            
            if (success) {
                colorLog('\n🎉 ¡Conexión exitosa!', 'green');
            } else {
                colorLog('\n⚠️  Hubo problemas con la conexión', 'yellow');
            }
        } catch (error) {
            colorLog(`\n❌ Error probando conexión: ${error.message}`, 'red');
            colorLog('💡 Puedes probar manualmente con: cd backend && node test-connection.js', 'blue');
        }
    }
    
    // Resumen final
    colorLog('\n🎯 CONFIGURACIÓN COMPLETADA', 'green');
    colorLog('========================\n', 'green');
    
    colorLog('✅ Archivo .env creado', 'green');
    colorLog('✅ Variables de entorno configuradas', 'green');
    colorLog('✅ .gitignore actualizado', 'green');
    
    colorLog('\n📋 PRÓXIMOS PASOS:', 'cyan');
    colorLog('1. cd backend', 'blue');
    colorLog('2. node setup-database.js    # Crear tablas', 'blue');
    colorLog('3. npm run dev               # Iniciar servidor', 'blue');
    colorLog('4. Abrir http://localhost:3000', 'blue');
    
    colorLog('\n🔧 COMANDOS ÚTILES:', 'cyan');
    colorLog('• node test-connection.js    # Probar conexión', 'blue');
    colorLog('• node test-connection.js --setup  # Setup + prueba', 'blue');
    colorLog('• npm run dev               # Servidor desarrollo', 'blue');
    
    colorLog('\n📚 DOCUMENTACIÓN:', 'cyan');
    colorLog('• RAILWAY_SETUP_GUIDE.md   # Guía completa', 'blue');
    colorLog('• Railway Dashboard: https://railway.app/dashboard', 'blue');
    
    colorLog('\n🎉 ¡Tu proyecto está listo para usar Railway!', 'green');
    
    rl.close();
}

// Manejar errores
process.on('unhandledRejection', (error) => {
    colorLog(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
});

process.on('SIGINT', () => {
    colorLog('\n\n👋 Setup cancelado por el usuario', 'yellow');
    rl.close();
    process.exit(0);
});

// Ejecutar
if (require.main === module) {
    main().catch((error) => {
        colorLog(`\n❌ Error en setup: ${error.message}`, 'red');
        process.exit(1);
    });
}

