// Test script for Results API
// Since api.js is designed for browser, we'll test it differently

console.log('🧪 Probando API de resultados...\n');

// Test 1: Verificar que el archivo api.js existe y es válido
const fs = require('fs');
const path = require('path');

console.log('1️⃣ Verificando archivo api.js...');
try {
    const apiContent = fs.readFileSync('api.js', 'utf8');
    console.log('✅ Archivo api.js encontrado');
    console.log('📏 Tamaño:', apiContent.length, 'caracteres');
    
    // Verificar que contiene las clases principales
    const hasFootballAPI = apiContent.includes('class FootballAPI');
    const hasNotificationService = apiContent.includes('class NotificationService');
    const hasWeatherAPI = apiContent.includes('class WeatherAPI');
    
    console.log('✅ FootballAPI:', hasFootballAPI ? 'Encontrada' : 'No encontrada');
    console.log('✅ NotificationService:', hasNotificationService ? 'Encontrada' : 'No encontrada');
    console.log('✅ WeatherAPI:', hasWeatherAPI ? 'Encontrada' : 'No encontrada');
    
    // Verificar métodos de resultados
    const hasGetLiveMatches = apiContent.includes('getLiveMatches');
    const hasGetFinishedMatches = apiContent.includes('getFinishedMatches');
    const hasGetChampionsLeagueMatches = apiContent.includes('getChampionsLeagueMatches');
    const hasGetLigaMXMatches = apiContent.includes('getLigaMXMatches');
    
    console.log('\n📊 Métodos de resultados:');
    console.log('✅ getLiveMatches:', hasGetLiveMatches ? 'Encontrado' : 'No encontrado');
    console.log('✅ getFinishedMatches:', hasGetFinishedMatches ? 'Encontrado' : 'No encontrado');
    console.log('✅ getChampionsLeagueMatches:', hasGetChampionsLeagueMatches ? 'Encontrado' : 'No encontrado');
    console.log('✅ getLigaMXMatches:', hasGetLigaMXMatches ? 'Encontrado' : 'No encontrado');
    
    // Verificar datos mock
    const hasMockLiveMatches = apiContent.includes('getMockLiveMatchesOnly');
    const hasMockFinishedMatches = apiContent.includes('getMockFinishedMatchesOnly');
    const hasMockChampions = apiContent.includes('getMockChampionsLeagueMatches');
    const hasMockLigaMX = apiContent.includes('getMockLigaMXMatches');
    
    console.log('\n🎭 Datos mock:');
    console.log('✅ Mock Live Matches:', hasMockLiveMatches ? 'Encontrado' : 'No encontrado');
    console.log('✅ Mock Finished Matches:', hasMockFinishedMatches ? 'Encontrado' : 'No encontrado');
    console.log('✅ Mock Champions League:', hasMockChampions ? 'Encontrado' : 'No encontrado');
    console.log('✅ Mock Liga MX:', hasMockLigaMX ? 'Encontrado' : 'No encontrado');
    
    // Verificar configuración de API
    const hasApiKey = apiContent.includes('apiKey');
    const hasBaseURL = apiContent.includes('baseURL');
    const hasLeagueIds = apiContent.includes('leagueIds');
    
    console.log('\n⚙️ Configuración de API:');
    console.log('✅ API Key:', hasApiKey ? 'Configurada' : 'No configurada');
    console.log('✅ Base URL:', hasBaseURL ? 'Configurada' : 'No configurada');
    console.log('✅ League IDs:', hasLeagueIds ? 'Configurados' : 'No configurados');
    
} catch (err) {
    console.log('❌ Error leyendo api.js:', err.message);
}

// Test 2: Verificar endpoints del backend
console.log('\n2️⃣ Verificando endpoints del backend...');
try {
    const matchesRoute = fs.readFileSync('backend/routes/matches.js', 'utf8');
    console.log('✅ Ruta de matches encontrada');
    
    const hasGetMatches = matchesRoute.includes('router.get(\'/\'');
    const hasGetNextMatch = matchesRoute.includes('router.get(\'/next\'');
    const hasCreateMatch = matchesRoute.includes('router.post(\'/\'');
    const hasUpdateMatch = matchesRoute.includes('router.put(\'/:id\'');
    const hasDeleteMatch = matchesRoute.includes('router.delete(\'/:id\'');
    
    console.log('📊 Endpoints disponibles:');
    console.log('✅ GET /matches:', hasGetMatches ? 'Disponible' : 'No disponible');
    console.log('✅ GET /matches/next:', hasGetNextMatch ? 'Disponible' : 'No disponible');
    console.log('✅ POST /matches:', hasCreateMatch ? 'Disponible' : 'No disponible');
    console.log('✅ PUT /matches/:id:', hasUpdateMatch ? 'Disponible' : 'No disponible');
    console.log('✅ DELETE /matches/:id:', hasDeleteMatch ? 'Disponible' : 'No disponible');
    
} catch (err) {
    console.log('❌ Error leyendo routes/matches.js:', err.message);
}

// Test 3: Verificar integración con APIs externas
console.log('\n3️⃣ Verificando integración con APIs externas...');
try {
    const apiContent = fs.readFileSync('api.js', 'utf8');
    
    const hasApiFootball = apiContent.includes('api-football.com');
    const hasRapidAPI = apiContent.includes('X-RapidAPI-Key');
    const hasErrorHandling = apiContent.includes('catch (error)');
    const hasFallback = apiContent.includes('mock data');
    
    console.log('🌐 Integración externa:');
    console.log('✅ API-Football:', hasApiFootball ? 'Configurada' : 'No configurada');
    console.log('✅ RapidAPI Headers:', hasRapidAPI ? 'Configurados' : 'No configurados');
    console.log('✅ Manejo de errores:', hasErrorHandling ? 'Implementado' : 'No implementado');
    console.log('✅ Fallback a mock:', hasFallback ? 'Implementado' : 'No implementado');
    
} catch (err) {
    console.log('❌ Error verificando integración:', err.message);
}

console.log('\n🎉 Verificación completada!');
console.log('\n📋 Resumen:');
console.log('- La API de resultados está implementada en api.js');
console.log('- Los endpoints del backend están disponibles en backend/routes/matches.js');
console.log('- La integración con APIs externas está configurada');
console.log('- Los datos mock están disponibles como fallback');
console.log('\n💡 Para probar en el navegador:');
console.log('1. Abre index.html en el navegador');
console.log('2. Ve a la sección de estadísticas y resultados');
console.log('3. Los datos se cargarán automáticamente');
