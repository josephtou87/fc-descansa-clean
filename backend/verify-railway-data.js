#!/usr/bin/env node

/**
 * 🔍 Verificador de Datos en Railway
 * 
 * Este script te permite ver en tiempo real los datos guardados en Railway
 * Ejecuta: node verify-railway-data.js
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

function formatTable(rows, headers) {
    if (rows.length === 0) {
        return '(Sin datos)';
    }

    const maxLengths = headers.map(header => 
        Math.max(header.length, ...rows.map(row => String(row[header] || '').length))
    );

    let table = '';
    
    // Header
    table += '┌' + maxLengths.map(len => '─'.repeat(len + 2)).join('┬') + '┐\n';
    table += '│' + headers.map((header, i) => 
        ` ${header.padEnd(maxLengths[i])} `
    ).join('│') + '│\n';
    table += '├' + maxLengths.map(len => '─'.repeat(len + 2)).join('┼') + '┤\n';
    
    // Rows
    rows.forEach(row => {
        table += '│' + headers.map((header, i) => 
            ` ${String(row[header] || '').padEnd(maxLengths[i])} `
        ).join('│') + '│\n';
    });
    
    table += '└' + maxLengths.map(len => '─'.repeat(len + 2)).join('┴') + '┘';
    
    return table;
}

async function showDatabaseInfo() {
    colorLog('📊 INFORMACIÓN DE LA BASE DE DATOS', 'cyan');
    colorLog('==================================\n', 'cyan');
    
    try {
        // Información general
        const dbInfo = await query('SELECT version(), current_database(), current_user');
        const dbSize = await query('SELECT pg_size_pretty(pg_database_size(current_database())) as size');
        
        colorLog(`🗄️  Base de datos: ${dbInfo.rows[0].current_database}`, 'blue');
        colorLog(`👤 Usuario: ${dbInfo.rows[0].current_user}`, 'blue');
        colorLog(`📏 Tamaño: ${dbSize.rows[0].size}`, 'blue');
        colorLog(`🐘 PostgreSQL: ${dbInfo.rows[0].version.split(' ')[1]}`, 'blue');
        
        // Información de conexión
        const connInfo = await query('SELECT inet_server_addr(), inet_server_port()');
        if (connInfo.rows[0].inet_server_addr) {
            colorLog(`🌐 Servidor: ${connInfo.rows[0].inet_server_addr}:${connInfo.rows[0].inet_server_port}`, 'blue');
        }
        
        console.log('');
        
    } catch (error) {
        colorLog(`❌ Error obteniendo info: ${error.message}`, 'red');
    }
}

async function showTableStats() {
    colorLog('📋 ESTADÍSTICAS DE TABLAS', 'yellow');
    colorLog('========================\n', 'yellow');
    
    try {
        const tablesQuery = `
            SELECT 
                schemaname,
                tablename,
                attname as column_name,
                typname as data_type
            FROM pg_stats 
            WHERE schemaname = 'public'
            ORDER BY tablename, attname;
        `;
        
        // Contar registros por tabla
        const tables = ['players', 'matches', 'notifications', 'match_confirmations'];
        
        for (const table of tables) {
            try {
                const countResult = await query(`SELECT COUNT(*) as count FROM ${table}`);
                const count = countResult.rows[0].count;
                
                if (count > 0) {
                    colorLog(`✅ ${table}: ${count} registros`, 'green');
                } else {
                    colorLog(`⚪ ${table}: 0 registros`, 'yellow');
                }
            } catch (error) {
                colorLog(`❌ ${table}: Tabla no existe`, 'red');
            }
        }
        
        console.log('');
        
    } catch (error) {
        colorLog(`❌ Error obteniendo estadísticas: ${error.message}`, 'red');
    }
}

async function showPlayersData() {
    colorLog('👥 DATOS DE JUGADORES', 'green');
    colorLog('===================\n', 'green');
    
    try {
        const playersResult = await query(`
            SELECT 
                id,
                full_name,
                nickname,
                jersey_number,
                position,
                email,
                whatsapp,
                is_active,
                created_at::date as registered_date
            FROM players 
            ORDER BY jersey_number
        `);
        
        if (playersResult.rows.length === 0) {
            colorLog('📝 No hay jugadores registrados aún', 'yellow');
            colorLog('💡 Registra un jugador desde la aplicación web', 'blue');
        } else {
            const headers = ['id', 'full_name', 'nickname', 'jersey_number', 'position', 'email', 'is_active', 'registered_date'];
            console.log(formatTable(playersResult.rows, headers));
            
            colorLog(`\n📊 Total de jugadores: ${playersResult.rows.length}`, 'green');
            
            // Estadísticas adicionales
            const activeCount = playersResult.rows.filter(p => p.is_active).length;
            const inactiveCount = playersResult.rows.length - activeCount;
            
            colorLog(`✅ Activos: ${activeCount}`, 'green');
            if (inactiveCount > 0) {
                colorLog(`❌ Inactivos: ${inactiveCount}`, 'red');
            }
            
            // Jugadores por posición
            const positions = {};
            playersResult.rows.forEach(player => {
                positions[player.position] = (positions[player.position] || 0) + 1;
            });
            
            colorLog('\n📍 Por posición:', 'blue');
            Object.entries(positions).forEach(([position, count]) => {
                colorLog(`   ${position}: ${count}`, 'blue');
            });
        }
        
        console.log('');
        
    } catch (error) {
        colorLog(`❌ Error obteniendo jugadores: ${error.message}`, 'red');
    }
}

async function showMatchesData() {
    colorLog('⚽ DATOS DE PARTIDOS', 'magenta');
    colorLog('==================\n', 'magenta');
    
    try {
        const matchesResult = await query(`
            SELECT 
                id,
                home_team,
                away_team,
                date,
                time,
                venue,
                status,
                created_at::date as created_date
            FROM matches 
            ORDER BY date DESC, time DESC
        `);
        
        if (matchesResult.rows.length === 0) {
            colorLog('📝 No hay partidos registrados', 'yellow');
        } else {
            const headers = ['id', 'home_team', 'away_team', 'date', 'time', 'venue', 'status'];
            console.log(formatTable(matchesResult.rows, headers));
            
            colorLog(`\n📊 Total de partidos: ${matchesResult.rows.length}`, 'magenta');
        }
        
        console.log('');
        
    } catch (error) {
        colorLog(`❌ Error obteniendo partidos: ${error.message}`, 'red');
    }
}

async function showRecentActivity() {
    colorLog('🕒 ACTIVIDAD RECIENTE', 'cyan');
    colorLog('===================\n', 'cyan');
    
    try {
        // Últimos jugadores registrados
        const recentPlayers = await query(`
            SELECT 
                full_name,
                jersey_number,
                position,
                created_at
            FROM players 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        
        if (recentPlayers.rows.length > 0) {
            colorLog('👥 Últimos jugadores registrados:', 'green');
            recentPlayers.rows.forEach(player => {
                const timeAgo = new Date(player.created_at).toLocaleString();
                colorLog(`   • ${player.full_name} (#${player.jersey_number}) - ${timeAgo}`, 'blue');
            });
        }
        
        // Últimas notificaciones
        const recentNotifications = await query(`
            SELECT 
                type,
                recipient,
                status,
                created_at
            FROM notifications 
            ORDER BY created_at DESC 
            LIMIT 3
        `);
        
        if (recentNotifications.rows.length > 0) {
            colorLog('\n📱 Últimas notificaciones:', 'yellow');
            recentNotifications.rows.forEach(notif => {
                const timeAgo = new Date(notif.created_at).toLocaleString();
                colorLog(`   • ${notif.type} → ${notif.recipient} (${notif.status}) - ${timeAgo}`, 'blue');
            });
        }
        
        console.log('');
        
    } catch (error) {
        colorLog(`❌ Error obteniendo actividad: ${error.message}`, 'red');
    }
}

async function watchLiveChanges() {
    colorLog('👁️  MONITOREO EN TIEMPO REAL', 'bright');
    colorLog('============================\n', 'bright');
    
    colorLog('🔄 Monitoreando cambios cada 5 segundos...', 'blue');
    colorLog('💡 Presiona Ctrl+C para detener\n', 'yellow');
    
    let lastPlayerCount = 0;
    let lastMatchCount = 0;
    
    const checkChanges = async () => {
        try {
            const playerCount = await query('SELECT COUNT(*) as count FROM players');
            const matchCount = await query('SELECT COUNT(*) as count FROM matches');
            
            const currentPlayerCount = parseInt(playerCount.rows[0].count);
            const currentMatchCount = parseInt(matchCount.rows[0].count);
            
            if (currentPlayerCount !== lastPlayerCount) {
                const change = currentPlayerCount - lastPlayerCount;
                const symbol = change > 0 ? '📈' : '📉';
                colorLog(`${symbol} Jugadores: ${lastPlayerCount} → ${currentPlayerCount} (${change > 0 ? '+' : ''}${change})`, 'green');
                lastPlayerCount = currentPlayerCount;
            }
            
            if (currentMatchCount !== lastMatchCount) {
                const change = currentMatchCount - lastMatchCount;
                const symbol = change > 0 ? '📈' : '📉';
                colorLog(`${symbol} Partidos: ${lastMatchCount} → ${currentMatchCount} (${change > 0 ? '+' : ''}${change})`, 'magenta');
                lastMatchCount = currentMatchCount;
            }
            
        } catch (error) {
            colorLog(`❌ Error en monitoreo: ${error.message}`, 'red');
        }
    };
    
    // Obtener conteos iniciales
    try {
        const initialPlayerCount = await query('SELECT COUNT(*) as count FROM players');
        const initialMatchCount = await query('SELECT COUNT(*) as count FROM matches');
        
        lastPlayerCount = parseInt(initialPlayerCount.rows[0].count);
        lastMatchCount = parseInt(initialMatchCount.rows[0].count);
        
        colorLog(`📊 Estado inicial - Jugadores: ${lastPlayerCount}, Partidos: ${lastMatchCount}`, 'blue');
        
    } catch (error) {
        colorLog(`❌ Error obteniendo estado inicial: ${error.message}`, 'red');
        return;
    }
    
    const interval = setInterval(checkChanges, 5000);
    
    process.on('SIGINT', () => {
        clearInterval(interval);
        colorLog('\n👋 Monitoreo detenido', 'yellow');
        process.exit(0);
    });
}

async function runCustomQuery() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    colorLog('🔍 CONSULTA PERSONALIZADA', 'cyan');
    colorLog('========================\n', 'cyan');
    
    colorLog('💡 Ejemplos de consultas:', 'blue');
    colorLog('   SELECT * FROM players WHERE position = \'Portero\';', 'blue');
    colorLog('   SELECT COUNT(*) FROM players WHERE is_active = true;', 'blue');
    colorLog('   SELECT * FROM matches WHERE date >= CURRENT_DATE;', 'blue');
    colorLog('   \\dt  (listar tablas)', 'blue');
    colorLog('   \\d players  (describir tabla players)\n', 'blue');
    
    const askQuery = () => {
        rl.question('SQL> ', async (sqlQuery) => {
            if (sqlQuery.toLowerCase().trim() === 'exit' || sqlQuery.toLowerCase().trim() === 'quit') {
                rl.close();
                return;
            }
            
            if (!sqlQuery.trim()) {
                askQuery();
                return;
            }
            
            try {
                const result = await query(sqlQuery);
                
                if (result.rows && result.rows.length > 0) {
                    const headers = Object.keys(result.rows[0]);
                    console.log('\n' + formatTable(result.rows, headers));
                    colorLog(`\n📊 ${result.rows.length} filas devueltas\n`, 'green');
                } else if (result.rowCount !== undefined) {
                    colorLog(`✅ Consulta ejecutada. Filas afectadas: ${result.rowCount}\n`, 'green');
                } else {
                    colorLog('✅ Consulta ejecutada exitosamente\n', 'green');
                }
                
            } catch (error) {
                colorLog(`❌ Error: ${error.message}\n`, 'red');
            }
            
            askQuery();
        });
    };
    
    askQuery();
}

function showHelp() {
    colorLog('🔍 VERIFICADOR DE DATOS EN RAILWAY', 'cyan');
    colorLog('=================================\n', 'cyan');
    
    colorLog('Uso: node verify-railway-data.js [opción]\n', 'blue');
    
    colorLog('Opciones:', 'yellow');
    colorLog('  --info      Información general de la BD', 'blue');
    colorLog('  --stats     Estadísticas de tablas', 'blue');
    colorLog('  --players   Ver todos los jugadores', 'blue');
    colorLog('  --matches   Ver todos los partidos', 'blue');
    colorLog('  --recent    Actividad reciente', 'blue');
    colorLog('  --watch     Monitoreo en tiempo real', 'blue');
    colorLog('  --query     Ejecutar consultas personalizadas', 'blue');
    colorLog('  --all       Mostrar todo (por defecto)', 'blue');
    colorLog('  --help      Mostrar esta ayuda\n', 'blue');
    
    colorLog('Ejemplos:', 'yellow');
    colorLog('  node verify-railway-data.js --players', 'blue');
    colorLog('  node verify-railway-data.js --watch', 'blue');
    colorLog('  node verify-railway-data.js --query\n', 'blue');
}

async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        return;
    }
    
    console.clear();
    
    try {
        if (args.includes('--info')) {
            await showDatabaseInfo();
        } else if (args.includes('--stats')) {
            await showTableStats();
        } else if (args.includes('--players')) {
            await showPlayersData();
        } else if (args.includes('--matches')) {
            await showMatchesData();
        } else if (args.includes('--recent')) {
            await showRecentActivity();
        } else if (args.includes('--watch')) {
            await watchLiveChanges();
        } else if (args.includes('--query')) {
            await runCustomQuery();
        } else {
            // Mostrar todo por defecto
            await showDatabaseInfo();
            await showTableStats();
            await showPlayersData();
            await showMatchesData();
            await showRecentActivity();
            
            colorLog('💡 Comandos útiles:', 'cyan');
            colorLog('   node verify-railway-data.js --watch   # Monitoreo en tiempo real', 'blue');
            colorLog('   node verify-railway-data.js --query   # Consultas personalizadas', 'blue');
        }
        
    } catch (error) {
        colorLog(`❌ Error: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Manejar errores
process.on('unhandledRejection', (error) => {
    colorLog(`\n❌ Error no manejado: ${error.message}`, 'red');
    process.exit(1);
});

if (require.main === module) {
    main();
}


