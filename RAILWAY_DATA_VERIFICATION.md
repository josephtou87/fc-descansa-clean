# 🔍 Cómo Verificar Datos en Railway - Guía Completa

## 🎯 **5 Formas de Ver Tus Datos en Railway**

---

## 🚀 **MÉTODO 1: Script Automático (Más Fácil)**

### ✨ **Verificación Completa**
```bash
cd backend
node verify-railway-data.js
```

**Esto te mostrará:**
- ✅ Información de la base de datos
- ✅ Estadísticas de tablas
- ✅ Todos los jugadores registrados
- ✅ Partidos guardados
- ✅ Actividad reciente

### 🔍 **Verificaciones Específicas**
```bash
# Solo ver jugadores
node verify-railway-data.js --players

# Solo estadísticas
node verify-railway-data.js --stats

# Monitoreo en tiempo real
node verify-railway-data.js --watch

# Consultas personalizadas
node verify-railway-data.js --query
```

---

## 🌐 **MÉTODO 2: Railway Dashboard (Visual)**

### 📋 **Paso a Paso:**

1. **Ir a Railway Dashboard**
   - Ve a: https://railway.app/dashboard
   - Inicia sesión con tu cuenta

2. **Seleccionar tu Proyecto**
   - Haz clic en tu proyecto de FC Descansa
   - Verás tu servicio PostgreSQL

3. **Abrir Query Editor**
   - Haz clic en tu servicio **PostgreSQL**
   - Ve a la pestaña **"Query"**
   - Aquí puedes ejecutar consultas SQL

### 🔍 **Consultas Útiles en Railway:**

```sql
-- Ver todos los jugadores
SELECT * FROM players ORDER BY jersey_number;

-- Contar jugadores por posición
SELECT position, COUNT(*) as cantidad 
FROM players 
WHERE is_active = true 
GROUP BY position;

-- Ver jugadores registrados hoy
SELECT full_name, jersey_number, created_at 
FROM players 
WHERE created_at::date = CURRENT_DATE;

-- Ver últimos 10 jugadores registrados
SELECT full_name, nickname, jersey_number, position, created_at 
FROM players 
ORDER BY created_at DESC 
LIMIT 10;

-- Estadísticas generales
SELECT 
    COUNT(*) as total_jugadores,
    COUNT(CASE WHEN is_active THEN 1 END) as activos,
    COUNT(CASE WHEN NOT is_active THEN 1 END) as inactivos
FROM players;
```

### 📊 **Ver Métricas en Railway:**
- Ve a **"Metrics"** para ver uso de CPU, memoria, etc.
- Ve a **"Logs"** para ver conexiones y consultas
- Ve a **"Variables"** para verificar tu DATABASE_URL

---

## 💻 **MÉTODO 3: Desde tu Aplicación Web**

### 🧪 **Prueba en Tiempo Real:**

1. **Registrar un Jugador**
   - Abre: `http://localhost:3000`
   - Ve a "Iniciar Sesión" → "Registro"
   - Llena el formulario y registra un jugador

2. **Verificar Inmediatamente**
   ```bash
   # En otra terminal
   cd backend
   node verify-railway-data.js --players
   ```

3. **Ver el Cambio**
   - Deberías ver el nuevo jugador en la lista
   - ✅ Confirmación de que se guardó en Railway

---

## 🔄 **MÉTODO 4: Monitoreo en Tiempo Real**

### 👁️ **Ver Cambios al Instante:**

```bash
cd backend
node verify-railway-data.js --watch
```

**Esto te mostrará:**
- 🔄 Cambios cada 5 segundos
- 📈 Cuando se registra un nuevo jugador
- 📊 Contadores actualizados en tiempo real
- 💡 Presiona `Ctrl+C` para detener

### 📱 **Prueba Práctica:**
1. Ejecuta el monitoreo: `node verify-railway-data.js --watch`
2. En tu navegador, registra un jugador
3. **¡Verás el cambio inmediatamente en la terminal!**

---

## 🛠️ **MÉTODO 5: Consultas Personalizadas**

### 🔍 **SQL Interactivo:**

```bash
cd backend
node verify-railway-data.js --query
```

**Consultas de ejemplo:**
```sql
-- Ver jugador específico
SELECT * FROM players WHERE jersey_number = 10;

-- Buscar por nombre
SELECT * FROM players WHERE full_name ILIKE '%juan%';

-- Ver jugadores por posición
SELECT * FROM players WHERE position = 'Portero';

-- Contar registros
SELECT COUNT(*) FROM players;

-- Ver estructura de tabla
\d players

-- Listar todas las tablas
\dt
```

---

## 📊 **Qué Datos Deberías Ver**

### 👥 **Tabla `players`:**
```
┌────┬─────────────┬──────────┬───────────────┬───────────┬─────────────────┬───────────┬──────────────┐
│ id │ full_name   │ nickname │ jersey_number │ position  │ email           │ is_active │ created_at   │
├────┼─────────────┼──────────┼───────────────┼───────────┼─────────────────┼───────────┼──────────────┤
│ 1  │ Juan Pérez  │ Juanito  │ 10            │ Delantero │ juan@test.com   │ true      │ 2024-01-15   │
│ 2  │ Carlos Ruiz │ Carlitos │ 1             │ Portero   │ carlos@test.com │ true      │ 2024-01-15   │
└────┴─────────────┴──────────┴───────────────┴───────────┴─────────────────┴───────────┴──────────────┘
```

### ⚽ **Tabla `matches`:**
```
┌────┬─────────────┬─────────────┬────────────┬──────────┬─────────────────┬───────────┐
│ id │ home_team   │ away_team   │ date       │ time     │ venue           │ status    │
├────┼─────────────┼─────────────┼────────────┼──────────┼─────────────────┼───────────┤
│ 1  │ FC Descansa │ FC Titanes  │ 2025-09-28 │ 08:00:00 │ Cancha Panteón  │ scheduled │
└────┴─────────────┴─────────────┴────────────┴──────────┴─────────────────┴───────────┘
```

---

## 🚨 **Solución de Problemas**

### ❌ **"No se muestran datos"**
```bash
# Verificar conexión
cd backend
node test-connection.js

# Verificar que las tablas existan
node setup-database.js
```

### ❌ **"Error de conexión"**
1. Verifica tu archivo `.env`
2. Asegúrate de que Railway esté activo
3. Revisa la `DATABASE_URL`

### ❌ **"Tabla no existe"**
```bash
cd backend
node setup-database.js
```

---

## 🎯 **Flujo Completo de Verificación**

### 🔄 **Proceso Recomendado:**

1. **Registrar Jugador**
   ```
   Navegador → Registro → Llenar formulario → Enviar
   ```

2. **Verificar Inmediatamente**
   ```bash
   cd backend
   node verify-railway-data.js --players
   ```

3. **Confirmar en Railway Dashboard**
   ```
   Railway.app → Tu proyecto → PostgreSQL → Query → SELECT * FROM players;
   ```

4. **Monitorear Cambios**
   ```bash
   node verify-railway-data.js --watch
   ```

---

## 🎉 **¡Datos Confirmados!**

### ✅ **Si ves esto, todo funciona:**
- 📊 Jugadores aparecen en las consultas
- 🔄 Contadores aumentan al registrar
- 💾 Datos persisten después de cerrar la app
- 🌐 Visible tanto local como en Railway Dashboard

### 🚀 **Próximos Pasos:**
- ✅ Tu base de datos está funcionando
- ✅ Los datos se guardan correctamente
- ✅ Puedes monitorear en tiempo real
- ✅ ¡Listo para producción!

---

## 📞 **Comandos de Referencia Rápida**

```bash
# Verificación completa
node verify-railway-data.js

# Solo jugadores
node verify-railway-data.js --players

# Monitoreo en tiempo real
node verify-railway-data.js --watch

# Consultas personalizadas
node verify-railway-data.js --query

# Probar conexión
node test-connection.js

# Recrear tablas
node setup-database.js
```

**¡Tu base de datos en Railway está funcionando perfectamente!** 🎯


