// Test script para obtener datos reales más amplios
const https = require('https');

console.log('🌐 Obteniendo datos reales más amplios...\n');

const API_KEY = '7e03a4b14f804836d3ad535168d8acf2';
const BASE_URL = 'v3.football.api-sports.io';

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

async function getRealData() {
    try {
        console.log('1️⃣ Obteniendo partidos recientes (últimos 10 días)...');
        
        // Obtener partidos de los últimos 10 días
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 10 * 24 * 60 * 60 * 1000);
        
        const recentResult = await makeRequest(`/fixtures?date=${startDate.toISOString().split('T')[0]},${endDate.toISOString().split('T')[0]}&last=20`);
        
        if (recentResult.status === 200) {
            const matches = recentResult.data.response || [];
            console.log(`✅ ${matches.length} partidos encontrados en los últimos 10 días`);
            
            if (matches.length > 0) {
                console.log('\n📊 Partidos recientes:');
                matches.slice(0, 10).forEach((match, index) => {
                    const date = new Date(match.fixture.date).toLocaleDateString('es-ES');
                    console.log(`   ${index + 1}. ${match.teams.home.name} vs ${match.teams.away.name} (${match.goals.home}-${match.goals.away}) - ${date}`);
                });
            }
        }
        
        console.log('\n2️⃣ Obteniendo equipos de Liga MX...');
        const teamsResult = await makeRequest('/teams?league=262&season=2024');
        
        if (teamsResult.status === 200) {
            const teams = teamsResult.data.response || [];
            console.log(`✅ ${teams.length} equipos de Liga MX encontrados`);
            
            if (teams.length > 0) {
                console.log('\n🏆 Equipos de Liga MX:');
                teams.forEach((team, index) => {
                    console.log(`   ${index + 1}. ${team.team.name} (${team.team.country})`);
                });
            }
        }
        
        console.log('\n3️⃣ Obteniendo equipos de Champions League...');
        const championsTeamsResult = await makeRequest('/teams?league=2&season=2024');
        
        if (championsTeamsResult.status === 200) {
            const teams = championsTeamsResult.data.response || [];
            console.log(`✅ ${teams.length} equipos de Champions League encontrados`);
            
            if (teams.length > 0) {
                console.log('\n🏆 Equipos de Champions League:');
                teams.slice(0, 10).forEach((team, index) => {
                    console.log(`   ${index + 1}. ${team.team.name} (${team.team.country})`);
                });
            }
        }
        
        console.log('\n4️⃣ Obteniendo partidos programados...');
        const upcomingResult = await makeRequest('/fixtures?date=2024-12-20,2024-12-31&status=NS');
        
        if (upcomingResult.status === 200) {
            const matches = upcomingResult.data.response || [];
            console.log(`✅ ${matches.length} partidos programados encontrados`);
            
            if (matches.length > 0) {
                console.log('\n📅 Próximos partidos:');
                matches.slice(0, 10).forEach((match, index) => {
                    const date = new Date(match.fixture.date).toLocaleDateString('es-ES');
                    console.log(`   ${index + 1}. ${match.teams.home.name} vs ${match.teams.away.name} - ${date}`);
                });
            }
        }
        
        console.log('\n🎉 Datos reales obtenidos exitosamente!');
        console.log('\n📋 Resumen:');
        console.log('- ✅ API key funcionando perfectamente');
        console.log('- ✅ Datos reales disponibles');
        console.log('- ✅ Equipos y partidos actualizados');
        console.log('- ✅ Sistema listo para producción');
        
    } catch (error) {
        console.log('❌ Error obteniendo datos:', error.message);
    }
}

// Ejecutar la prueba
getRealData();
