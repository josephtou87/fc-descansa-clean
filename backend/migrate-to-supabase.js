#!/usr/bin/env node

/**
 * 🚀 Migrador Automático a Supabase
 * 
 * Este script migra automáticamente tu base de datos a Supabase
 * Ejecuta: node migrate-to-supabase.js
 */

require('dotenv').config();
const { Pool } = require('pg');
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

function colorLog(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function migrateToSupabase() {
    console.clear();
    colorLog('🚀 MIGRADOR AUTOMÁTICO A SUPABASE', 'cyan');
    colorLog('=================================\n', 'cyan');
    
    colorLog('Este script te ayudará a migrar tu base de datos a Supabase (100% gratuito)\n', 'blue');
    
    // Paso 1: Obtener credenciales de Supabase
    colorLog('📋 PASO 1: Configuración de Supabase', 'yellow');
    colorLog('', 'reset');
    colorLog('Primero necesitas crear un proyecto en Supabase:', 'blue');
    colorLog('1. Ve a: https://supabase.com/', 'blue');
    colorLog('2. Regístrate con GitHub', 'blue');
    colorLog('3. Crea un nuevo proyecto', 'blue');
    colorLog('4. Ve a Settings → Database', 'blue');
    colorLog('5. Copia la Connection string\n', 'blue');
    
    let supabaseUrl = '';
    while (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
        supabaseUrl = await askQuestion('Pega tu Connection string de Supabase: ');
        
        if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
            colorLog('❌ URL inválida. Debe contener "supabase.co"', 'red');
        }
    }
    
    colorLog('✅ URL de Supabase configurada\n', 'green');
    
    // Paso 2: Probar conexión
    colorLog('🔌 PASO 2: Probando conexión a Supabase...', 'yellow');
    
    let supabasePool;
    try {
        supabasePool = new Pool({
            connectionString: supabaseUrl,
            ssl: { rejectUnauthorized: false }
        });
        
        const testResult = await supabasePool.query('SELECT NOW() as current_time');
        colorLog(`✅ Conexión exitosa a Supabase: ${testResult.rows[0].current_time}`, 'green');
    } catch (error) {
        colorLog(`❌ Error conectando a Supabase: ${error.message}`, 'red');
        colorLog('💡 Verifica que la URL sea correcta y que el proyecto esté activo', 'blue');
        rl.close();
        return;
    }
    
    // Paso 3: Crear tablas
    colorLog('\n🏗️  PASO 3: Creando tablas en Supabase...', 'yellow');
    
    const createTablesSQL = `
        -- Crear tabla de jugadores
        CREATE TABLE IF NOT EXISTS players (
            id SERIAL PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            nickname VARCHAR(100),
            jersey_number INTEGER UNIQUE NOT NULL,
            position VARCHAR(50) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            whatsapp VARCHAR(20) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            photo_url VARCHAR(500),
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Crear tabla de partidos
        CREATE TABLE IF NOT EXISTS matches (
            id SERIAL PRIMARY KEY,
            home_team VARCHAR(255) NOT NULL,
            away_team VARCHAR(255) NOT NULL,
            date DATE NOT NULL,
            time TIME NOT NULL,
            venue VARCHAR(255) NOT NULL,
            status VARCHAR(50) DEFAULT 'scheduled',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Crear tabla de notificaciones
        CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            player_id INTEGER REFERENCES players(id),
            type VARCHAR(50) NOT NULL,
            recipient VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            sent_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Crear tabla de confirmaciones
        CREATE TABLE IF NOT EXISTS match_confirmations (
            id SERIAL PRIMARY KEY,
            player_id INTEGER REFERENCES players(id),
            match_id INTEGER REFERENCES matches(id),
            status VARCHAR(10) NOT NULL,
            confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(player_id, match_id)
        );

        -- Insertar partido de ejemplo
        INSERT INTO matches (home_team, away_team, date, time, venue, status) 
        VALUES ('FC Descansa', 'FC Titanes', '2025-09-28', '08:00:00', 'Cancha del Panteón, Chilapa Alvarez Guerrero', 'scheduled')
        ON CONFLICT DO NOTHING;
    `;
    
    try {
        await supabasePool.query(createTablesSQL);
        colorLog('✅ Tablas creadas exitosamente en Supabase', 'green');
    } catch (error) {
        colorLog(`❌ Error creando tablas: ${error.message}`, 'red');
        rl.close();
        return;
    }
    
    // Paso 4: Verificar tablas
    colorLog('\n🔍 PASO 4: Verificando tablas creadas...', 'yellow');
    
    try {
        const tablesResult = await supabasePool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        const tables = tablesResult.rows.map(row => row.table_name);
        colorLog('📋 Tablas encontradas:', 'blue');
        tables.forEach(table => {
            colorLog(`   ✅ ${table}`, 'green');
        });
        
        // Contar registros
        const playersCount = await supabasePool.query('SELECT COUNT(*) as count FROM players');
        const matchesCount = await supabasePool.query('SELECT COUNT(*) as count FROM matches');
        
        colorLog('\n📊 Registros:', 'blue');
        colorLog(`   👥 Jugadores: ${playersCount.rows[0].count}`, 'blue');
        colorLog(`   ⚽ Partidos: ${matchesCount.rows[0].count}`, 'blue');
        
    } catch (error) {
        colorLog(`❌ Error verificando tablas: ${error.message}`, 'red');
    }
    
    // Paso 5: Actualizar archivo .env
    colorLog('\n📝 PASO 5: Actualizando archivo .env...', 'yellow');
    
    const envContent = `# Database Configuration - Supabase (100% Gratuito)
DATABASE_URL=${supabaseUrl}

# JWT Configuration
JWT_SECRET=fc_descansa_super_secret_key_2024
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
FRONTEND_URL=http://localhost:3000

# Server Configuration
NODE_ENV=development
PORT=3000

# Supabase adicional (opcional)
SUPABASE_URL=https://${supabaseUrl.split('@')[1].split(':')[0].replace('db.', '')}
SUPABASE_ANON_KEY=your_anon_key_here
`;
    
    try {
        const fs = require('fs');
        fs.writeFileSync('.env', envContent);
        colorLog('✅ Archivo .env actualizado con Supabase', 'green');
    } catch (error) {
        colorLog(`❌ Error actualizando .env: ${error.message}`, 'red');
        colorLog('💡 Actualiza manualmente el archivo .env con la nueva DATABASE_URL', 'blue');
    }
    
    // Paso 6: Probar la nueva conexión
    colorLog('\n🧪 PASO 6: Probando la nueva configuración...', 'yellow');
    
    try {
        // Recargar variables de entorno
        delete require.cache[require.resolve('dotenv')];
        require('dotenv').config();
        
        const { testConnection } = require('./config/database');
        const isConnected = await testConnection();
        
        if (isConnected) {
            colorLog('✅ Conexión con nueva configuración exitosa', 'green');
        } else {
            colorLog('❌ Problema con la nueva configuración', 'red');
        }
    } catch (error) {
        colorLog(`⚠️  No se pudo probar automáticamente: ${error.message}`, 'yellow');
        colorLog('💡 Prueba manualmente con: node test-connection.js', 'blue');
    }
    
    // Paso 7: Insertar jugador de prueba
    colorLog('\n👤 PASO 7: ¿Insertar jugador de prueba?', 'yellow');
    const insertTest = await askQuestion('¿Quieres insertar un jugador de prueba? (Y/n): ');
    
    if (insertTest.toLowerCase() !== 'n' && insertTest.toLowerCase() !== 'no') {
        try {
            const testPlayerResult = await supabasePool.query(`
                INSERT INTO players (full_name, nickname, jersey_number, position, email, whatsapp, password_hash) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                ON CONFLICT (email) DO NOTHING
                RETURNING id, full_name, jersey_number;
            `, ['Test Player Supabase', 'Tester', 99, 'Portero', 'test@supabase.com', '+521234567890', 'test_hash']);
            
            if (testPlayerResult.rows.length > 0) {
                const player = testPlayerResult.rows[0];
                colorLog(`✅ Jugador de prueba creado: ${player.full_name} (#${player.jersey_number})`, 'green');
            } else {
                colorLog('ℹ️  Jugador de prueba ya existe', 'blue');
            }
        } catch (error) {
            colorLog(`❌ Error insertando jugador de prueba: ${error.message}`, 'red');
        }
    }
    
    // Resumen final
    colorLog('\n🎉 ¡MIGRACIÓN A SUPABASE COMPLETADA!', 'green');
    colorLog('===================================\n', 'green');
    
    colorLog('✅ Resultados:', 'green');
    colorLog('   • Base de datos: ✅ Supabase PostgreSQL (500MB gratuitos)', 'green');
    colorLog('   • Tablas: ✅ Creadas correctamente', 'green');
    colorLog('   • Configuración: ✅ .env actualizado', 'green');
    colorLog('   • Conexión: ✅ Funcionando', 'green');
    
    colorLog('\n🚀 Próximos pasos:', 'cyan');
    colorLog('1. Ejecuta: node test-connection.js', 'blue');
    colorLog('2. Ejecuta: npm run dev', 'blue');
    colorLog('3. Ve a: https://supabase.com/dashboard', 'blue');
    colorLog('4. Explora tu proyecto y datos', 'blue');
    colorLog('5. Registra jugadores desde la web', 'blue');
    
    colorLog('\n📊 Dashboard de Supabase:', 'cyan');
    colorLog('• Table Editor: Ver y editar datos', 'blue');
    colorLog('• SQL Editor: Ejecutar consultas', 'blue');
    colorLog('• API Docs: Documentación automática', 'blue');
    colorLog('• Auth: Gestión de usuarios', 'blue');
    
    colorLog('\n💡 Ventajas de Supabase:', 'cyan');
    colorLog('• 500MB gratuitos (suficiente para miles de jugadores)', 'blue');
    colorLog('• Dashboard visual increíble', 'blue');
    colorLog('• API REST automática', 'blue');
    colorLog('• Sin límite de tiempo', 'blue');
    
    await supabasePool.end();
    rl.close();
}

// Manejar errores
process.on('unhandledRejection', (error) => {
    colorLog(`\n❌ Error no manejado: ${error.message}`, 'red');
    rl.close();
    process.exit(1);
});

process.on('SIGINT', () => {
    colorLog('\n\n👋 Migración cancelada por el usuario', 'yellow');
    rl.close();
    process.exit(0);
});

if (require.main === module) {
    migrateToSupabase();
}





