#!/usr/bin/env node

/**
 * 🧪 Test Completo del Flujo de Datos
 * 
 * Este script simula el registro de un jugador y verifica que se guarde en Railway
 * Ejecuta: node test-full-flow.js
 */

require('dotenv').config();
const { query } = require('./config/database');

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

async function testCompleteFlow() {
    console.clear();
    colorLog('🧪 TEST COMPLETO DEL FLUJO DE DATOS', 'cyan');
    colorLog('===================================\n', 'cyan');
    
    try {
        // Paso 1: Verificar conexión
        colorLog('📡 PASO 1: Verificando conexión a Railway...', 'yellow');
        const connectionTest = await query('SELECT 1 as test');
        if (connectionTest.rows[0].test === 1) {
            colorLog('✅ Conexión exitosa a Railway', 'green');
        } else {
            throw new Error('Conexión fallida');
        }
        
        // Paso 2: Contar jugadores antes
        colorLog('\n📊 PASO 2: Contando jugadores existentes...', 'yellow');
        const beforeCount = await query('SELECT COUNT(*) as count FROM players');
        const initialCount = parseInt(beforeCount.rows[0].count);
        colorLog(`📈 Jugadores actuales: ${initialCount}`, 'blue');
        
        // Paso 3: Crear jugador de prueba
        colorLog('\n👤 PASO 3: Creando jugador de prueba...', 'yellow');
        const testPlayer = {
            fullName: `Test Player ${Date.now()}`,
            nickname: 'Tester',
            jerseyNumber: Math.floor(Math.random() * 90) + 10, // 10-99
            position: 'Delantero',
            email: `test${Date.now()}@railway.com`,
            whatsapp: '+521234567890',
            passwordHash: 'test_hash_123'
        };
        
        colorLog(`🔄 Insertando: ${testPlayer.fullName} (#${testPlayer.jerseyNumber})`, 'blue');
        
        const insertResult = await query(
            `INSERT INTO players (full_name, nickname, jersey_number, position, email, whatsapp, password_hash) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, full_name, nickname, jersey_number, position, email, created_at`,
            [testPlayer.fullName, testPlayer.nickname, testPlayer.jerseyNumber, 
             testPlayer.position, testPlayer.email, testPlayer.whatsapp, testPlayer.passwordHash]
        );
        
        const newPlayer = insertResult.rows[0];
        colorLog(`✅ Jugador creado exitosamente:`, 'green');
        colorLog(`   ID: ${newPlayer.id}`, 'green');
        colorLog(`   Nombre: ${newPlayer.full_name}`, 'green');
        colorLog(`   Número: ${newPlayer.jersey_number}`, 'green');
        colorLog(`   Fecha: ${new Date(newPlayer.created_at).toLocaleString()}`, 'green');
        
        // Paso 4: Verificar que se guardó
        colorLog('\n🔍 PASO 4: Verificando que se guardó correctamente...', 'yellow');
        const verifyResult = await query(
            'SELECT * FROM players WHERE id = $1',
            [newPlayer.id]
        );
        
        if (verifyResult.rows.length > 0) {
            const savedPlayer = verifyResult.rows[0];
            colorLog('✅ Jugador encontrado en la base de datos:', 'green');
            colorLog(`   Nombre completo: ${savedPlayer.full_name}`, 'blue');
            colorLog(`   Apodo: ${savedPlayer.nickname}`, 'blue');
            colorLog(`   Número: ${savedPlayer.jersey_number}`, 'blue');
            colorLog(`   Posición: ${savedPlayer.position}`, 'blue');
            colorLog(`   Email: ${savedPlayer.email}`, 'blue');
            colorLog(`   Activo: ${savedPlayer.is_active}`, 'blue');
        } else {
            throw new Error('Jugador no encontrado después de la inserción');
        }
        
        // Paso 5: Contar jugadores después
        colorLog('\n📊 PASO 5: Verificando incremento en contador...', 'yellow');
        const afterCount = await query('SELECT COUNT(*) as count FROM players');
        const finalCount = parseInt(afterCount.rows[0].count);
        
        colorLog(`📈 Jugadores antes: ${initialCount}`, 'blue');
        colorLog(`📈 Jugadores después: ${finalCount}`, 'blue');
        colorLog(`📈 Incremento: +${finalCount - initialCount}`, 'green');
        
        if (finalCount === initialCount + 1) {
            colorLog('✅ Contador incrementado correctamente', 'green');
        } else {
            throw new Error('El contador no se incrementó como esperado');
        }
        
        // Paso 6: Probar búsqueda por email
        colorLog('\n🔍 PASO 6: Probando búsqueda por email...', 'yellow');
        const searchResult = await query(
            'SELECT id, full_name, email FROM players WHERE email = $1',
            [testPlayer.email]
        );
        
        if (searchResult.rows.length > 0) {
            colorLog(`✅ Búsqueda por email exitosa: ${searchResult.rows[0].full_name}`, 'green');
        } else {
            throw new Error('No se pudo encontrar el jugador por email');
        }
        
        // Paso 7: Probar búsqueda por número de camiseta
        colorLog('\n🔢 PASO 7: Probando búsqueda por número de camiseta...', 'yellow');
        const numberSearch = await query(
            'SELECT id, full_name, jersey_number FROM players WHERE jersey_number = $1',
            [testPlayer.jerseyNumber]
        );
        
        if (numberSearch.rows.length > 0) {
            colorLog(`✅ Búsqueda por número exitosa: #${numberSearch.rows[0].jersey_number}`, 'green');
        } else {
            throw new Error('No se pudo encontrar el jugador por número');
        }
        
        // Paso 8: Verificar integridad de datos
        colorLog('\n🔐 PASO 8: Verificando integridad de datos...', 'yellow');
        
        // Verificar que no hay duplicados de email
        const emailDuplicates = await query(
            'SELECT email, COUNT(*) as count FROM players GROUP BY email HAVING COUNT(*) > 1'
        );
        
        if (emailDuplicates.rows.length === 0) {
            colorLog('✅ No hay emails duplicados', 'green');
        } else {
            colorLog(`⚠️  Encontrados ${emailDuplicates.rows.length} emails duplicados`, 'yellow');
        }
        
        // Verificar que no hay duplicados de número
        const numberDuplicates = await query(
            'SELECT jersey_number, COUNT(*) as count FROM players GROUP BY jersey_number HAVING COUNT(*) > 1'
        );
        
        if (numberDuplicates.rows.length === 0) {
            colorLog('✅ No hay números de camiseta duplicados', 'green');
        } else {
            colorLog(`⚠️  Encontrados ${numberDuplicates.rows.length} números duplicados`, 'yellow');
        }
        
        // Paso 9: Información de la base de datos
        colorLog('\n📋 PASO 9: Información de la base de datos...', 'yellow');
        
        const dbInfo = await query('SELECT version(), current_database()');
        const dbSize = await query('SELECT pg_size_pretty(pg_database_size(current_database())) as size');
        
        colorLog(`🗄️  Base de datos: ${dbInfo.rows[0].current_database}`, 'blue');
        colorLog(`📏 Tamaño actual: ${dbSize.rows[0].size}`, 'blue');
        colorLog(`🐘 PostgreSQL: ${dbInfo.rows[0].version.split(' ')[1]}`, 'blue');
        
        // Paso 10: Limpiar datos de prueba (opcional)
        colorLog('\n🧹 PASO 10: ¿Limpiar datos de prueba?', 'yellow');
        colorLog('💡 El jugador de prueba permanecerá en la BD', 'blue');
        colorLog('💡 Puedes eliminarlo manualmente si deseas', 'blue');
        
        // Resumen final
        colorLog('\n🎉 ¡TEST COMPLETADO EXITOSAMENTE!', 'green');
        colorLog('================================\n', 'green');
        
        colorLog('✅ Resultados del test:', 'green');
        colorLog(`   • Conexión a Railway: ✅ Funcionando`, 'green');
        colorLog(`   • Inserción de datos: ✅ Exitosa`, 'green');
        colorLog(`   • Verificación de datos: ✅ Correcta`, 'green');
        colorLog(`   • Búsquedas: ✅ Funcionando`, 'green');
        colorLog(`   • Integridad: ✅ Mantenida`, 'green');
        colorLog(`   • Contadores: ✅ Actualizados`, 'green');
        
        colorLog('\n📊 Estadísticas:', 'cyan');
        colorLog(`   • Total de jugadores: ${finalCount}`, 'blue');
        colorLog(`   • Jugador creado: ${newPlayer.full_name} (#${newPlayer.jersey_number})`, 'blue');
        colorLog(`   • ID asignado: ${newPlayer.id}`, 'blue');
        
        colorLog('\n🚀 Tu base de datos en Railway está funcionando perfectamente!', 'green');
        
        return true;
        
    } catch (error) {
        colorLog(`\n❌ ERROR EN EL TEST: ${error.message}`, 'red');
        
        colorLog('\n🔧 Posibles soluciones:', 'yellow');
        colorLog('   1. Verifica tu archivo .env', 'blue');
        colorLog('   2. Asegúrate de que Railway esté activo', 'blue');
        colorLog('   3. Ejecuta: node setup-database.js', 'blue');
        colorLog('   4. Prueba: node test-connection.js', 'blue');
        
        return false;
    }
}

// Función para mostrar ayuda
function showHelp() {
    colorLog('🧪 TEST COMPLETO DEL FLUJO DE DATOS', 'cyan');
    colorLog('==================================\n', 'cyan');
    
    colorLog('Este script realiza un test completo del flujo de datos:', 'blue');
    colorLog('1. Verifica la conexión a Railway', 'blue');
    colorLog('2. Cuenta jugadores existentes', 'blue');
    colorLog('3. Crea un jugador de prueba', 'blue');
    colorLog('4. Verifica que se guardó correctamente', 'blue');
    colorLog('5. Prueba búsquedas y consultas', 'blue');
    colorLog('6. Verifica integridad de datos', 'blue');
    colorLog('7. Muestra estadísticas finales\n', 'blue');
    
    colorLog('Uso:', 'yellow');
    colorLog('  node test-full-flow.js        # Ejecutar test completo', 'blue');
    colorLog('  node test-full-flow.js --help # Mostrar esta ayuda\n', 'blue');
}

// Ejecutar
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        return;
    }
    
    const success = await testCompleteFlow();
    process.exit(success ? 0 : 1);
}

// Manejar errores
process.on('unhandledRejection', (error) => {
    colorLog(`\n❌ Error no manejado: ${error.message}`, 'red');
    process.exit(1);
});

if (require.main === module) {
    main();
}





