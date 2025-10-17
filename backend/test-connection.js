#!/usr/bin/env node

/**
 * Script de Verificación de Conexión a Railway
 * Ejecuta: node test-connection.js
 */

require('dotenv').config();
const { testConnection, query } = require('./config/database');

async function testRailwayConnection() {
    console.log('🚂 Probando conexión a Railway...\n');
    
    // Test 1: Conexión básica
    console.log('📡 Test 1: Conexión básica');
    try {
        const isConnected = await testConnection();
        if (isConnected) {
            console.log('✅ Conexión exitosa a Railway PostgreSQL');
        } else {
            console.log('❌ Fallo en la conexión');
            return false;
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        return false;
    }

    // Test 2: Verificar variables de entorno
    console.log('\n🔧 Test 2: Variables de entorno');
    const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
    let allVarsPresent = true;
    
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`✅ ${varName}: Configurada`);
        } else {
            console.log(`❌ ${varName}: NO configurada`);
            allVarsPresent = false;
        }
    });

    if (!allVarsPresent) {
        console.log('\n⚠️  Algunas variables de entorno faltan. Revisa tu archivo .env');
        return false;
    }

    // Test 3: Verificar tablas
    console.log('\n📊 Test 3: Verificando tablas');
    try {
        const tablesResult = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        
        const expectedTables = ['players', 'matches', 'notifications', 'match_confirmations'];
        const existingTables = tablesResult.rows.map(row => row.table_name);
        
        expectedTables.forEach(tableName => {
            if (existingTables.includes(tableName)) {
                console.log(`✅ Tabla '${tableName}': Existe`);
            } else {
                console.log(`❌ Tabla '${tableName}': NO existe`);
            }
        });

        if (existingTables.length === 0) {
            console.log('\n⚠️  No se encontraron tablas. Ejecuta: node setup-database.js');
            return false;
        }

    } catch (error) {
        console.error('❌ Error verificando tablas:', error.message);
        return false;
    }

    // Test 4: Probar inserción y consulta
    console.log('\n🧪 Test 4: Prueba de inserción/consulta');
    try {
        // Insertar jugador de prueba
        const testPlayer = await query(`
            INSERT INTO players (full_name, nickname, jersey_number, position, email, whatsapp, password_hash) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            ON CONFLICT (email) DO NOTHING
            RETURNING id, full_name;
        `, ['Test Player', 'Tester', 99, 'Portero', 'test@railway.com', '+521234567890', 'test_hash']);

        if (testPlayer.rows.length > 0) {
            console.log(`✅ Inserción exitosa: ${testPlayer.rows[0].full_name}`);
        } else {
            console.log('ℹ️  Jugador de prueba ya existe (normal)');
        }

        // Consultar jugadores
        const playersCount = await query('SELECT COUNT(*) as count FROM players');
        console.log(`✅ Total de jugadores en BD: ${playersCount.rows[0].count}`);

    } catch (error) {
        console.error('❌ Error en prueba de inserción:', error.message);
        return false;
    }

    // Test 5: Información de la base de datos
    console.log('\n📋 Test 5: Información de la BD');
    try {
        const dbInfo = await query('SELECT version()');
        console.log(`✅ PostgreSQL Version: ${dbInfo.rows[0].version.split(' ')[1]}`);
        
        const dbSize = await query(`
            SELECT pg_size_pretty(pg_database_size(current_database())) as size
        `);
        console.log(`✅ Tamaño de BD: ${dbSize.rows[0].size}`);

    } catch (error) {
        console.error('❌ Error obteniendo info de BD:', error.message);
    }

    console.log('\n🎉 ¡Todos los tests pasaron! Tu conexión a Railway está funcionando correctamente.');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Ejecuta: npm run dev (para iniciar el servidor)');
    console.log('   2. Abre: http://localhost:3000');
    console.log('   3. Prueba registrar un jugador');
    
    return true;
}

// Función para mostrar ayuda
function showHelp() {
    console.log(`
🚂 Script de Verificación de Railway

Uso: node test-connection.js [opción]

Opciones:
  --help, -h     Mostrar esta ayuda
  --setup        Ejecutar setup de tablas automáticamente
  --clean        Limpiar datos de prueba

Ejemplos:
  node test-connection.js           # Verificación completa
  node test-connection.js --setup   # Verificar + crear tablas
  node test-connection.js --clean   # Limpiar datos de prueba
`);
}

// Función para setup automático
async function autoSetup() {
    console.log('🔧 Ejecutando setup automático...\n');
    try {
        const { setupDatabase } = require('./setup-database');
        await setupDatabase();
        console.log('\n✅ Setup completado. Ejecutando verificación...\n');
        return await testRailwayConnection();
    } catch (error) {
        console.error('❌ Error en setup automático:', error.message);
        return false;
    }
}

// Función para limpiar datos de prueba
async function cleanTestData() {
    console.log('🧹 Limpiando datos de prueba...\n');
    try {
        await query("DELETE FROM players WHERE email = 'test@railway.com'");
        console.log('✅ Datos de prueba eliminados');
    } catch (error) {
        console.error('❌ Error limpiando datos:', error.message);
    }
}

// Ejecutar según argumentos
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }
    
    if (args.includes('--setup')) {
        const success = await autoSetup();
        process.exit(success ? 0 : 1);
    }
    
    if (args.includes('--clean')) {
        await cleanTestData();
        process.exit(0);
    }
    
    // Verificación normal
    const success = await testRailwayConnection();
    process.exit(success ? 0 : 1);
}

// Manejar errores no capturados
process.on('unhandledRejection', (error) => {
    console.error('\n❌ Error no manejado:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verifica tu archivo .env');
    console.log('   2. Asegúrate de que Railway esté activo');
    console.log('   3. Revisa la DATABASE_URL');
    process.exit(1);
});

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { testRailwayConnection };

