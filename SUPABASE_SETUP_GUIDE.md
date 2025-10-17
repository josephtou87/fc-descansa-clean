# 🚀 Guía Completa: Configurar Supabase (100% Gratuito)

## 🎯 **¿Por qué Supabase?**

- ✅ **500MB PostgreSQL gratuitos**
- ✅ **Dashboard visual increíble**
- ✅ **API REST automática**
- ✅ **Autenticación incluida**
- ✅ **Sin límite de tiempo**
- ✅ **Muy fácil de usar**

---

## 🔧 **PASO 1: Crear Cuenta y Proyecto**

### **1.1 Registrarse**
1. Ve a: https://supabase.com/
2. Haz clic en **"Start your project"**
3. Selecciona **"Sign up with GitHub"**
4. Autoriza Supabase

### **1.2 Crear Proyecto**
1. Haz clic en **"New project"**
2. **Organization**: Selecciona tu organización
3. **Name**: `fc-descansa-db`
4. **Database Password**: Crea una contraseña segura (¡GUÁRDALA!)
5. **Region**: `East US (North Virginia)` (más rápida)
6. **Pricing Plan**: Asegúrate de que sea **"Free"**
7. Haz clic en **"Create new project"**

### **1.3 Esperar Setup**
- ⏱️ Toma 1-2 minutos
- Verás una barra de progreso
- ✅ Cuando termine, verás el dashboard

---

## 🔑 **PASO 2: Obtener Credenciales**

### **2.1 Ir a Settings**
1. En el dashboard, haz clic en **⚙️ Settings** (menú lateral)
2. Selecciona **"Database"**

### **2.2 Copiar Connection String**
1. Busca la sección **"Connection string"**
2. Selecciona **"URI"**
3. Copia la cadena completa:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
4. **Reemplaza `[YOUR-PASSWORD]`** con tu contraseña real

### **2.3 Obtener URL de la API**
1. Ve a **Settings → API**
2. Copia la **"URL"** (para uso futuro)
3. Copia la **"anon public"** key (para uso futuro)

---

## 🏗️ **PASO 3: Crear las Tablas**

### **3.1 Abrir SQL Editor**
1. En el dashboard, haz clic en **🔍 SQL Editor** (menú lateral)
2. Haz clic en **"New query"**

### **3.2 Ejecutar Script de Creación**
```sql
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
VALUES ('FC Descansa', 'FC Titanes', '2025-09-28', '08:00:00', 'Cancha del Panteón, Chilapa Alvarez Guerrero', 'scheduled');

-- Verificar que se crearon las tablas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

### **3.3 Ejecutar el Script**
1. **Pega el código** en el editor
2. Haz clic en **"Run"** (▶️)
3. **Deberías ver**: `Success. No rows returned`

---

## ⚙️ **PASO 4: Configurar tu Aplicación**

### **4.1 Actualizar Variables de Entorno**

#### **Para desarrollo local:**
```env
# Archivo: backend/.env
DATABASE_URL=postgresql://postgres:TU_PASSWORD@db.xxx.supabase.co:5432/postgres
JWT_SECRET=fc_descansa_super_secret_key_2024
JWT_EXPIRES_IN=7d
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@fcdescansa.com
FROM_NAME=FC Descansa
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_NUMBER=+1234567890
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=3000

# Variables adicionales de Supabase (opcional)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
```

#### **Para Vercel:**
1. Ve a **Vercel Dashboard**
2. Tu proyecto → **Settings → Environment Variables**
3. Agrega:
   - `DATABASE_URL`: Tu connection string de Supabase
   - `JWT_SECRET`: `fc_descansa_super_secret_key_2024`
4. **Redeploy** tu proyecto

---

## 🧪 **PASO 5: Probar la Conexión**

### **5.1 Desde Local**
```bash
cd backend
node test-connection.js
```

**Deberías ver:**
```
🚂 Probando conexión a Supabase...
✅ Conexión exitosa a Supabase PostgreSQL
```

### **5.2 Desde Vercel**
**Ve a:** `https://tu-app.vercel.app/api/verify-db`

**Deberías ver:**
```json
{
  "status": "success",
  "message": "Base de datos funcionando correctamente"
}
```

---

## 📊 **PASO 6: Usar el Dashboard de Supabase**

### **6.1 Ver Datos en Tiempo Real**
1. Ve a **📊 Table Editor** (menú lateral)
2. Selecciona la tabla **"players"**
3. Verás todos los jugadores registrados

### **6.2 Insertar Datos Manualmente**
1. Haz clic en **"Insert row"**
2. Llena los campos
3. Haz clic en **"Save"**

### **6.3 Ejecutar Consultas**
1. Ve a **🔍 SQL Editor**
2. Ejecuta consultas como:
   ```sql
   SELECT * FROM players ORDER BY created_at DESC;
   SELECT COUNT(*) FROM players;
   ```

---

## 🎯 **VENTAJAS DE SUPABASE**

### **✅ Dashboard Increíble**
- 📊 Ver datos en tablas visuales
- 🔍 Editor SQL integrado
- 📈 Métricas en tiempo real
- 🔐 Gestión de usuarios

### **✅ API Automática**
- 🚀 REST API generada automáticamente
- 🔄 Real-time subscriptions
- 🔐 Row Level Security
- 📝 Documentación automática

### **✅ Autenticación**
- 👤 Login con email/password
- 🔗 OAuth (Google, GitHub, etc.)
- 🔐 JWT tokens
- 👥 Gestión de usuarios

---

## 🚨 **Límites del Plan Gratuito**

### **📊 Límites Generosos:**
- 🗄️ **500MB de almacenamiento**
- 👥 **50,000 usuarios activos mensuales**
- 🔄 **500MB de transferencia de datos**
- 📧 **2GB de ancho de banda**

### **💡 Para FC Descansa:**
- ✅ **Suficiente para 1000+ jugadores**
- ✅ **Miles de partidos**
- ✅ **Años de uso gratuito**

---

## 🔧 **Solución de Problemas**

### **❌ Error: "Invalid connection string"**
- Verifica que reemplazaste `[YOUR-PASSWORD]` con tu contraseña real
- Asegúrate de no tener espacios extra

### **❌ Error: "relation does not exist"**
- Ejecuta el script de creación de tablas en SQL Editor
- Verifica que las tablas se crearon correctamente

### **❌ Error: "too many connections"**
- Usa connection pooling en tu aplicación
- El plan gratuito tiene límite de conexiones concurrentes

---

## 🎉 **¡Listo para Usar!**

### **✅ Lo que tienes ahora:**
- 🗄️ Base de datos PostgreSQL gratuita
- 📊 Dashboard visual increíble
- 🚀 API REST automática
- 🔐 Sistema de autenticación
- 📈 Métricas en tiempo real

### **🚀 Próximos pasos:**
1. **Probar registro** de jugadores
2. **Ver datos** en el dashboard
3. **Configurar autenticación** avanzada (opcional)
4. **Usar la API** de Supabase (opcional)

**¡Tu base de datos gratuita está lista para producción!** 🎯
