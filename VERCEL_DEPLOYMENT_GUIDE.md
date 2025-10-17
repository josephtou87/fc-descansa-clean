# 🚀 Guía Completa: Desplegar en Vercel con Supabase

## 🎯 **Configuración Paso a Paso**

---

## 🔧 **PASO 1: Configurar Variables de Entorno en Vercel**

### **1.1 Acceder a Vercel Dashboard**
1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto de FC Descansa
3. Haz clic en **"Settings"**
4. Ve a **"Environment Variables"**

### **1.2 Agregar Variables Requeridas**

**Haz clic en "Add New" para cada variable:**

#### **🗄️ Base de Datos (Supabase)**
```
Name: DATABASE_URL
Value: postgresql://postgres:123452025@db.sswhmfkamjftvuthmgeb.supabase.co:5432/postgres
Environment: Production, Preview, Development
```

#### **🔐 Autenticación**
```
Name: JWT_SECRET
Value: fc_descansa_super_secret_key_2024
Environment: Production, Preview, Development
```

```
Name: JWT_EXPIRES_IN
Value: 7d
Environment: Production, Preview, Development
```

#### **📧 Email Configuration**
```
Name: FROM_EMAIL
Value: angelaustin959@gmail.com
Environment: Production, Preview, Development
```

```
Name: FROM_NAME
Value: FC Descansa
Environment: Production, Preview, Development
```

#### **🌐 Frontend URL**
```
Name: FRONTEND_URL
Value: https://tu-dominio.vercel.app
Environment: Production, Preview, Development
```
*Nota: Reemplaza "tu-dominio" con tu URL real de Vercel*

#### **⚙️ Server Configuration**
```
Name: NODE_ENV
Value: production
Environment: Production
```

```
Name: PORT
Value: 3000
Environment: Production, Preview, Development
```

#### **🚀 Supabase Adicional**
```
Name: SUPABASE_URL
Value: https://sswhmfkamjftvuthmgeb.supabase.co
Environment: Production, Preview, Development
```

```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzd2htZmthbWpmdHZ1dGhtZ2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzMyMDYsImV4cCI6MjA3NDk0OTIwNn0.Wzn0X3GrbhM7_3Ni6gxRMs1RsxDIqcUWeW4ZGPwtDaI
Environment: Production, Preview, Development
```

### **1.3 Variables Opcionales (Dejar vacías)**
```
Name: SENDGRID_API_KEY
Value: (vacío)
Environment: Production, Preview, Development

Name: TWILIO_ACCOUNT_SID
Value: (vacío)
Environment: Production, Preview, Development

Name: TWILIO_AUTH_TOKEN
Value: (vacío)
Environment: Production, Preview, Development

Name: TWILIO_WHATSAPP_NUMBER
Value: (vacío)
Environment: Production, Preview, Development
```

---

## 📁 **PASO 2: Estructura de Archivos para Vercel**

### **2.1 Verificar Estructura**
Tu proyecto debe tener esta estructura:
```
fc.descansa.renace/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── config/
│   ├── routes/
│   └── services/
├── api/
│   ├── verify-db.js
│   └── players-stats.js
├── index.html
├── script.js
├── styles.css
├── vercel.json
└── package.json
```

### **2.2 Verificar vercel.json**
Debe contener la configuración correcta para backend y frontend.

---

## 🚀 **PASO 3: Desplegar en Vercel**

### **3.1 Desde GitHub (Recomendado)**
1. **Sube cambios a GitHub**:
   ```bash
   git add .
   git commit -m "Configure Vercel with Supabase"
   git push origin main
   ```

2. **Vercel desplegará automáticamente**
3. **Ve a tu dashboard de Vercel** para ver el progreso

### **3.2 Desde CLI de Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### **3.3 Redeploy Manual**
1. Ve a **Vercel Dashboard → Tu proyecto**
2. Ve a **"Deployments"**
3. Haz clic en **"Redeploy"** en el último deployment
4. Selecciona **"Use existing Build Cache"**
5. Haz clic en **"Redeploy"**

---

## 🧪 **PASO 4: Verificar Deployment**

### **4.1 Verificar Variables**
1. **Ve a Settings → Environment Variables**
2. **Verifica que todas estén configuradas**
3. **Asegúrate de que estén en "Production"**

### **4.2 Verificar Build Logs**
1. **Ve a "Deployments"**
2. **Haz clic en el último deployment**
3. **Ve a "Build Logs"**
4. **Busca errores en rojo**

### **4.3 Verificar Function Logs**
1. **Ve a "Functions"**
2. **Haz clic en "View Function Logs"**
3. **Verifica conexiones a Supabase**

---

## ✅ **PASO 5: Probar Funcionamiento**

### **5.1 Probar Endpoints de API**
```
https://tu-app.vercel.app/api/verify-db
https://tu-app.vercel.app/api/players-stats
```

**Deberías ver:**
```json
{
  "status": "success",
  "message": "Base de datos funcionando correctamente",
  "database_info": {
    "name": "postgres",
    "user": "postgres"
  },
  "statistics": {
    "total_players": 0,
    "total_matches": 1
  }
}
```

### **5.2 Probar Registro de Jugador**
1. **Ve a**: `https://tu-app.vercel.app`
2. **Navega a "Iniciar Sesión" → "Registro"**
3. **Registra un jugador de prueba**
4. **Verifica en Supabase Dashboard**

### **5.3 Probar Panel de Admin**
```
https://tu-app.vercel.app/admin-panel.html
```

---

## 🔧 **PASO 6: Solución de Problemas Comunes**

### **❌ Error 500: Internal Server Error**
**Causa**: Variables de entorno no configuradas
**Solución**:
1. Verifica todas las variables en Vercel
2. Asegúrate de que `DATABASE_URL` sea correcta
3. Redeploy el proyecto

### **❌ Error: "Cannot connect to database"**
**Causa**: Problema con Supabase
**Solución**:
1. Verifica que Supabase esté activo
2. Prueba la conexión desde Supabase Dashboard
3. Verifica que la `DATABASE_URL` sea correcta

### **❌ Error: "Function timeout"**
**Causa**: Consulta muy lenta
**Solución**:
1. Optimiza consultas SQL
2. Aumenta `maxDuration` en `vercel.json`
3. Usa connection pooling

### **❌ Error: "Module not found"**
**Causa**: Dependencias faltantes
**Solución**:
1. Verifica `package.json` en backend
2. Ejecuta `npm install` localmente
3. Sube cambios a GitHub

---

## 📊 **PASO 7: Monitoreo y Logs**

### **7.1 Ver Logs en Tiempo Real**
1. **Vercel Dashboard → Functions**
2. **"View Function Logs"**
3. **Filtra por errores o warnings**

### **7.2 Métricas de Performance**
1. **Ve a "Analytics"**
2. **Revisa tiempos de respuesta**
3. **Verifica uso de funciones**

### **7.3 Alertas**
1. **Configura notificaciones** en Vercel
2. **Monitorea uptime** con herramientas externas
3. **Revisa logs** regularmente

---

## 🎯 **PASO 8: Optimizaciones**

### **8.1 Connection Pooling**
```javascript
// En backend/config/database.js
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
```

### **8.2 Caching**
```javascript
// Cache responses para mejor performance
const cache = new Map();

app.get('/api/players', (req, res) => {
    const cacheKey = 'players';
    if (cache.has(cacheKey)) {
        return res.json(cache.get(cacheKey));
    }
    // ... fetch data and cache it
});
```

### **8.3 Error Handling**
```javascript
// Mejor manejo de errores
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});
```

---

## 🎉 **¡Deployment Exitoso!**

### **✅ Lo que tienes funcionando:**
- 🌐 **Frontend** desplegado en Vercel
- 🚀 **Backend API** como Vercel Functions
- 🗄️ **Base de datos** Supabase conectada
- 📊 **Endpoints de verificación** funcionando
- 🔐 **Autenticación** operativa
- 📱 **Registro de jugadores** en producción

### **🚀 URLs importantes:**
- **App principal**: `https://tu-app.vercel.app`
- **API verificación**: `https://tu-app.vercel.app/api/verify-db`
- **Panel admin**: `https://tu-app.vercel.app/admin-panel.html`
- **Supabase Dashboard**: `https://supabase.com/dashboard`

### **📈 Próximos pasos:**
1. **Configurar dominio personalizado** (opcional)
2. **Configurar SendGrid** para emails reales (opcional)
3. **Monitorear performance** y optimizar
4. **Configurar backups** automáticos

**¡Tu aplicación está 100% operativa en producción!** 🎯





