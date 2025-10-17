#!/usr/bin/env node

/**
 * 🔧 Reparador de Tablas de Railway
 * 
 * Este script diagnostica y repara problemas con las tablas de Railway
 * Ejecuta: node fix-railway-tables.js
 */

require('dotenv').config();
const { query, testConnection } = require('./config/database');

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

async function diagnoseConnection() {
    colorLog('🔍 DIAGNÓSTICO DE CONEXIÓN', 'cyan');
    colorLog('==========================\n', 'cyan');
    
    // Verificar variables de entorno
    colorLog('📋 Verificando variables de entorno...', 'yellow');
    
    if (!process.env.DATABASE_URL) {
        colorLog('❌ DATABASE_URL no está configurada', 'red');
        colorLog('💡 Solución: Verifica tu archivo .env', 'blue');
        return false;
    }
    
    colorLog('✅ DATABASE_URL está configurada', 'green');
    
    // Verificar formato de URL
    if (!process.env.DATABASE_URL.startsWith('postgresql://')) {
        colorLog('❌ DATABASE_URL no tiene formato PostgreSQL válido', 'red');
        colorLog('💡 Debe empezar con: postgresql://', 'blue');
        return false;
    }
    
    colorLog('✅ Formato de DATABASE_URL es válido', 'green');
    
    // Probar conexión
    colorLog('\n🔌 Probando conexión...', 'yellow');
    try {
        const isConnected = await testConnection();
        if (isConnected) {
            colorLog('✅ Conexión exitosa a Railway', 'green');
            return true;
        } else {
            colorLog('❌ Fallo en la conexión', 'red');
            return false;
        }
    } catch (error) {
        colorLog(`❌ Error de conexión: ${error.message}`, 'red');
        return false;
    }
}

async function createTablesManually() {
    colorLog('\n🏗️  CREANDO TABLAS MANUALMENTE', 'cyan');
    colorLog('===============================\n', 'cyan');
    
    const tables = [
        {
            name: 'players',
            sql: `
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
            `
        },
        {
            name: 'matches',
            sql: `
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
            `
        },
        {
            name: 'notifications',
            sql: `
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
            `
        },
        {
            name: 'match_confirmations',
            sql: `
                CREATE TABLE IF NOT EXISTS match_confirmations (
                    id SERIAL PRIMARY KEY,
                    player_id INTEGER REFERENCES players(id),
                    match_id INTEGER REFERENCES matches(id),
                    status VARCHAR(10) NOT NULL,
                    confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(player_id, match_id)
                );
            `
        }
    ];
    
    let successCount = 0;
    
    for (const table of tables) {
        try {
            colorLog(`🔨 Creando tabla '${table.name}'...`, 'yellow');
            await query(table.sql);
            colorLog(`✅ Tabla '${table.name}' creada exitosamente`, 'green');
            successCount++;
        } catch (error) {
            colorLog(`❌ Error creando tabla '${table.name}': ${error.message}`, 'red');
        }
    }
    
    colorLog(`\n📊 Resultado: ${successCount}/${tables.length} tablas creadas`, successCount === tables.length ? 'green' : 'yellow');
    
    return successCount === tables.length;
}

async function insertSampleData() {
    colorLog('\n📝 INSERTANDO DATOS DE EJEMPLO', 'cyan');
    colorLog('==============================\n', 'cyan');
    
    try {
        // Verificar si ya hay un partido de ejemplo
        const existingMatch = await query('SELECT COUNT(*) as count FROM matches');
        
        if (parseInt(existingMatch.rows[0].count) === 0) {
            colorLog('🏟️  Insertando partido de ejemplo...', 'yellow');
            await query(`
                INSERT INTO matches (home_team, away_team, date, time, venue, status) 
                VALUES ('FC Descansa', 'FC Titanes', '2025-09-28', '08:00:00', 'Cancha del Panteón, Chilapa Alvarez Guerrero', 'scheduled')
            `);
            colorLog('✅ Partido de ejemplo insertado', 'green');
        } else {
            colorLog('ℹ️  Ya existen partidos en la base de datos', 'blue');
        }
        
        return true;
    } catch (error) {
        colorLog(`❌ Error insertando datos de ejemplo: ${error.message}`, 'red');
        return false;
    }
}

async function verifyTables() {
    colorLog('\n🔍 VERIFICANDO TABLAS CREADAS', 'cyan');
    colorLog('=============================\n', 'cyan');
    
    try {
        const tablesResult = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        
        const existingTables = tablesResult.rows.map(row => row.table_name);
        const expectedTables = ['players', 'matches', 'notifications', 'match_confirmations'];
        
        colorLog('📋 Tablas encontradas:', 'blue');
        existingTables.forEach(tableName => {
            colorLog(`   ✅ ${tableName}`, 'green');
        });
        
        colorLog('\n📋 Verificando tablas requeridas:', 'blue');
        let allTablesExist = true;
        
        expectedTables.forEach(tableName => {
            if (existingTables.includes(tableName)) {
                colorLog(`   ✅ ${tableName}: Existe`, 'green');
            } else {
                colorLog(`   ❌ ${tableName}: NO existe`, 'red');
                allTablesExist = false;
            }
        });
        
        return allTablesExist;
        
    } catch (error) {
        colorLog(`❌ Error verificando tablas: ${error.message}`, 'red');
        return false;
    }
}

async function testDataInsertion() {
    colorLog('\n🧪 PROBANDO INSERCIÓN DE DATOS', 'cyan');
    colorLog('==============================\n', 'cyan');
    
    try {
        // Probar inserción de jugador
        colorLog('👤 Probando inserción de jugador...', 'yellow');
        
        const testPlayer = await query(`
            INSERT INTO players (full_name, nickname, jersey_number, position, email, whatsapp, password_hash) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            ON CONFLICT (email) DO NOTHING
            RETURNING id, full_name;
        `, ['Test Player Fix', 'Fixer', 98, 'Portero', 'test-fix@railway.com', '+521234567890', 'test_hash']);
        
        if (testPlayer.rows.length > 0) {
            colorLog(`✅ Jugador insertado: ${testPlayer.rows[0].full_name} (ID: ${testPlayer.rows[0].id})`, 'green');
        } else {
            colorLog('ℹ️  Jugador de prueba ya existe', 'blue');
        }
        
        // Verificar que se puede consultar
        const playerCount = await query('SELECT COUNT(*) as count FROM players');
        colorLog(`✅ Total de jugadores en BD: ${playerCount.rows[0].count}`, 'green');
        
        return true;
        
    } catch (error) {
        colorLog(`❌ Error probando inserción: ${error.message}`, 'red');
        return false;
    }
}

async function main() {
    console.clear();
    colorLog('🔧 REPARADOR DE TABLAS DE RAILWAY', 'bright');
    colorLog('=================================\n', 'bright');
    
    // Paso 1: Diagnóstico de conexión
    const connectionOk = await diagnoseConnection();
    if (!connectionOk) {
        colorLog('\n🆘 SOLUCIONES PARA PROBLEMAS DE CONEXIÓN:', 'red');
        colorLog('1. Verifica tu archivo backend/.env', 'yellow');
        colorLog('2. Asegúrate de que DATABASE_URL sea correcta', 'yellow');
        colorLog('3. Verifica que Railway esté activo', 'yellow');
        colorLog('4. Ejecuta: node setup-railway.js', 'yellow');
        process.exit(1);
    }
    
    // Paso 2: Crear tablas
    const tablesCreated = await createTablesManually();
    if (!tablesCreated) {
        colorLog('\n❌ No se pudieron crear todas las tablas', 'red');
        process.exit(1);
    }
    
    // Paso 3: Insertar datos de ejemplo
    await insertSampleData();
    
    // Paso 4: Verificar tablas
    const tablesVerified = await verifyTables();
    if (!tablesVerified) {
        colorLog('\n❌ Algunas tablas no se verificaron correctamente', 'red');
        process.exit(1);
    }
    
    // Paso 5: Probar inserción
    const insertionOk = await testDataInsertion();
    if (!insertionOk) {
        colorLog('\n❌ Problemas con la inserción de datos', 'red');
        process.exit(1);
    }
    
    // Éxito
    colorLog('\n🎉 ¡REPARACIÓN COMPLETADA EXITOSAMENTE!', 'green');
    colorLog('====================================\n', 'green');
    
    colorLog('✅ Resultados:', 'green');
    colorLog('   • Conexión a Railway: ✅ Funcionando', 'green');
    colorLog('   • Tablas creadas: ✅ Todas las tablas existen', 'green');
    colorLog('   • Datos de ejemplo: ✅ Insertados', 'green');
    colorLog('   • Inserción de datos: ✅ Funcionando', 'green');
    
    colorLog('\n🚀 Próximos pasos:', 'cyan');
    colorLog('1. Ejecuta: node verify-railway-data.js', 'blue');
    colorLog('2. Ejecuta: npm run dev', 'blue');
    colorLog('3. Registra un jugador desde la web', 'blue');
    colorLog('4. ¡Disfruta tu base de datos funcionando!', 'blue');
}

// Manejar errores
process.on('unhandledRejection', (error) => {
    colorLog(`\n❌ Error no manejado: ${error.message}`, 'red');
    process.exit(1);
});

if (require.main === module) {
    main();
}





