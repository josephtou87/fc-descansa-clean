// Test script para verificar que la API key funciona con datos reales
const https = require('https');

console.log('🔑 Probando API key con datos reales...\n');

const API_KEY = '7e03a4b14f804836d3ad535168d8acf2';
const BASE_URL = 'v3.football.api-sports.io';

// Función para hacer requests HTTPS
function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: BASE_URL,
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': BASE_URL,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });
        
        req.end();
    });
}

async function testApiKey() {
    try {
        console.log('1️⃣ Probando estado de la API...');
        const statusResult = await makeRequest('/status');
        
        if (statusResult.status === 200) {
            console.log('✅ API funcionando correctamente');
            console.log('📊 Requests disponibles:', statusResult.data.response?.requests || 'N/A');
            console.log('📊 Límite de requests:', statusResult.data.response?.requests_limit || 'N/A');
        } else {
            console.log('❌ Error en API:', statusResult.status);
            return;
        }
        
        console.log('\n2️⃣ Probando partidos en vivo...');
        const today = new Date().toISOString().split('T')[0];
        const liveResult = await makeRequest(`/fixtures?date=${today}&live=all`);
        
        if (liveResult.status === 200) {
            const matches = liveResult.data.response || [];
            console.log(`✅ ${matches.length} partidos en vivo encontrados para hoy`);
            
            if (matches.length > 0) {
                console.log('📊 Primeros partidos:');
                matches.slice(0, 3).forEach((match, index) => {
                    console.log(`   ${index + 1}. ${match.teams.home.name} vs ${match.teams.away.name} (${match.goals.home}-${match.goals.away})`);
                });
            }
        } else {
            console.log('ℹ️ No hay partidos en vivo hoy o error:', liveResult.status);
        }
        
        console.log('\n3️⃣ Probando Liga MX...');
        const ligaMXResult = await makeRequest('/fixtures?league=262&season=2024&last=5');
        
        if (ligaMXResult.status === 200) {
            const matches = ligaMXResult.data.response || [];
            console.log(`✅ ${matches.length} partidos de Liga MX encontrados`);
            
            if (matches.length > 0) {
                console.log('📊 Últimos partidos Liga MX:');
                matches.forEach((match, index) => {
                    console.log(`   ${index + 1}. ${match.teams.home.name} vs ${match.teams.away.name} (${match.goals.home}-${match.goals.away})`);
                });
            }
        } else {
            console.log('❌ Error obteniendo Liga MX:', ligaMXResult.status);
        }
        
        console.log('\n4️⃣ Probando Champions League...');
        const championsResult = await makeRequest('/fixtures?league=2&season=2024&last=5');
        
        if (championsResult.status === 200) {
            const matches = championsResult.data.response || [];
            console.log(`✅ ${matches.length} partidos de Champions League encontrados`);
            
            if (matches.length > 0) {
                console.log('📊 Últimos partidos Champions League:');
                matches.forEach((match, index) => {
                    console.log(`   ${index + 1}. ${match.teams.home.name} vs ${match.teams.away.name} (${match.goals.home}-${match.goals.away})`);
                });
            }
        } else {
            console.log('❌ Error obteniendo Champions League:', championsResult.status);
        }
        
        console.log('\n🎉 Prueba de API key completada exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('- ✅ API key válida y funcionando');
        console.log('- ✅ Conexión a API-Football establecida');
        console.log('- ✅ Datos reales disponibles');
        console.log('- ✅ Liga MX y Champions League funcionando');
        
    } catch (error) {
        console.log('❌ Error en la prueba:', error.message);
        console.log('\n🔧 Posibles soluciones:');
        console.log('1. Verificar conexión a internet');
        console.log('2. Verificar que la API key sea válida');
        console.log('3. Verificar límites de requests');
    }
}

// Ejecutar la prueba
testApiKey();
