# 🚂 Guía Completa: Configurar Base de Datos en Railway

## 📋 **Requisitos Previos**
- ✅ Cuenta de GitHub (para conectar con Railway)
- ✅ Navegador web moderno
- ✅ Node.js instalado (v16 o superior)
- ✅ Tu proyecto FC Descansa listo

---

## 🎯 **PASO 1: Crear Cuenta en Railway**

### 1.1 Registrarse en Railway
1. **Ve a Railway**: https://railway.app/
2. **Haz clic en "Start a New Project"**
3. **Selecciona "Login with GitHub"**
4. **Autoriza Railway** para acceder a tu cuenta de GitHub
5. **Completa tu perfil** si es necesario

### 1.2 Verificar Cuenta
- ✅ Recibirás $5 USD de créditos gratuitos
- ✅ Plan gratuito incluye 500MB de PostgreSQL
- ✅ No necesitas tarjeta de crédito inicialmente

---

## 🗄️ **PASO 2: Crear Base de Datos PostgreSQL**

### 2.1 Crear Nuevo Proyecto
1. **En el Dashboard de Railway**, haz clic en **"New Project"**
2. **Selecciona "Provision PostgreSQL"**
3. **Nombra tu proyecto**: `fc-descansa-db` (o el nombre que prefieras)
4. **Haz clic en "Create"**

### 2.2 Configurar PostgreSQL
1. **Railway creará automáticamente**:
   - ✅ Una instancia de PostgreSQL
   - ✅ Credenciales únicas
   - ✅ URL de conexión
   - ✅ SSL habilitado

2. **Espera 1-2 minutos** para que se complete la configuración

---

## 🔑 **PASO 3: Obtener Credenciales de Conexión**

### 3.1 Acceder a las Variables
1. **En tu proyecto de Railway**, haz clic en tu servicio PostgreSQL
2. **Ve a la pestaña "Variables"**
3. **Encontrarás estas variables**:
   ```
   DATABASE_URL
   PGDATABASE
   PGHOST
   PGPASSWORD
   PGPORT
   PGUSER
   ```

### 3.2 Copiar DATABASE_URL
1. **Busca la variable `DATABASE_URL`**
2. **Haz clic en el ícono de copiar** 📋
3. **Guárdala temporalmente** - se ve así:
   ```
   postgresql://postgres:XXXXXXXXXX@containers-us-west-XXX.railway.app:XXXX/railway
   ```

---

## ⚙️ **PASO 4: Configurar Variables de Entorno Locales**

### 4.1 Crear Archivo .env
1. **En la carpeta `backend/` de tu proyecto**, crea un archivo llamado `.env`
2. **Copia y pega este contenido**:

```env
# Database Configuration - Railway
DATABASE_URL=postgresql://postgres:TU_PASSWORD_AQUI@containers-us-west-XXX.railway.app:XXXX/railway

# JWT Configuration
JWT_SECRET=fc_descansa_super_secret_key_2024
JWT_EXPIRES_IN=7d

# SendGrid Email Service (opcional por ahora)
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@fcdescansa.com
FROM_NAME=FC Descansa

# Twilio WhatsApp Service (opcional por ahora)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_NUMBER=+1234567890

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server Configuration
NODE_ENV=development
PORT=3000
```

### 4.2 Reemplazar DATABASE_URL
1. **Reemplaza la línea `DATABASE_URL=`** con la URL que copiaste de Railway
2. **Guarda el archivo** `.env`

### 4.3 Verificar .gitignore
1. **Asegúrate de que `.env` esté en tu `.gitignore`**:
   ```
   # Environment variables
   .env
   .env.local
   .env.development.local
   ```

---

## 🏗️ **PASO 5: Instalar Dependencias y Configurar Backend**

### 5.1 Instalar Dependencias
```bash
# Navega a la carpeta backend
cd backend

# Instala las dependencias
npm install

# Verifica que se instalaron correctamente
npm list
```

### 5.2 Verificar Dependencias Clave
Asegúrate de que tienes estas dependencias:
- ✅ `pg` (PostgreSQL client)
- ✅ `dotenv` (variables de entorno)
- ✅ `express` (servidor web)
- ✅ `bcryptjs` (encriptación)
- ✅ `jsonwebtoken` (autenticación)

---

## 🎯 **PASO 6: Ejecutar Setup de Base de Datos**

### 6.1 Probar Conexión
```bash
# Desde la carpeta backend/
node -e "
const { testConnection } = require('./config/database');
testConnection().then(result => {
  console.log('Conexión:', result ? '✅ EXITOSA' : '❌ FALLIDA');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
"
```

### 6.2 Crear Tablas
```bash
# Ejecutar el setup de la base de datos
node setup-database.js
```

**Deberías ver algo como:**
```
🔧 Setting up database tables...
✅ Database tables created or already exist.
✅ Sample match inserted.
🎉 Database setup completed successfully!
✅ Setup completed successfully
```

---

## 🚀 **PASO 7: Iniciar el Servidor Backend**

### 7.1 Iniciar en Modo Desarrollo
```bash
# Desde backend/
npm run dev
```

### 7.2 Verificar que Funciona
**Deberías ver:**
```
🚀 Server running on port 3000
🔗 Database connected successfully
📧 Email service configured
📱 WhatsApp service configured
```

### 7.3 Probar Endpoints
**Abre otra terminal y prueba:**
```bash
# Probar endpoint de jugadores
curl http://localhost:3000/api/players

# Deberías recibir: {"players":[]}
```

---

## 🧪 **PASO 8: Probar Registro de Jugador**

### 8.1 Abrir la Aplicación
1. **Abre tu navegador**
2. **Ve a**: `http://localhost:3000` (o donde tengas tu `index.html`)
3. **Navega a la sección "Iniciar Sesión"**

### 8.2 Registrar un Jugador de Prueba
1. **Haz clic en "Registro"**
2. **Llena el formulario**:
   - Nombre: `Juan Pérez`
   - Apodo: `Juanito`
   - Número: `10`
   - Posición: `Delantero`
   - Email: `juan@test.com`
   - WhatsApp: `+521234567890`
   - Contraseña: `123456`

3. **Haz clic en "Registrar"**

### 8.3 Verificar en Railway
1. **Ve a tu proyecto en Railway**
2. **Haz clic en PostgreSQL > Query**
3. **Ejecuta esta consulta**:
   ```sql
   SELECT * FROM players;
   ```
4. **Deberías ver tu jugador registrado** ✅

---

## 🔍 **PASO 9: Verificación Final**

### 9.1 Probar Login
1. **En la aplicación, ve a "Iniciar Sesión"**
2. **Usa las credenciales del jugador que registraste**
3. **Deberías poder iniciar sesión exitosamente** ✅

### 9.2 Verificar Datos en Railway
**En Railway Query, ejecuta:**
```sql
-- Ver todos los jugadores
SELECT id, full_name, nickname, jersey_number, position, email FROM players;

-- Ver todas las tablas creadas
\dt

-- Contar registros
SELECT COUNT(*) as total_players FROM players;
```

---

## 🎉 **¡FELICIDADES! Tu Base de Datos Está Lista**

### ✅ **Lo que has logrado:**
- 🗄️ Base de datos PostgreSQL en Railway
- 🔐 Conexión segura con SSL
- 📊 Tablas creadas automáticamente
- 🧪 Registro y login funcionando
- 💾 Datos persistentes en la nube

### 🚀 **Próximos Pasos:**
1. **Desplegar el backend** en Railway también
2. **Configurar notificaciones** (SendGrid/Twilio)
3. **Conectar el frontend** desplegado

---

## 🆘 **Solución de Problemas Comunes**

### ❌ Error: "Connection refused"
**Solución:**
1. Verifica que la `DATABASE_URL` sea correcta
2. Asegúrate de que Railway esté activo
3. Revisa que no haya espacios extra en el `.env`

### ❌ Error: "relation does not exist"
**Solución:**
```bash
# Ejecutar nuevamente el setup
node setup-database.js
```

### ❌ Error: "JWT_SECRET not defined"
**Solución:**
1. Verifica que el archivo `.env` esté en `backend/`
2. Asegúrate de que `JWT_SECRET` esté definido
3. Reinicia el servidor

### ❌ Error: "Port already in use"
**Solución:**
```bash
# Matar procesos en puerto 3000
npx kill-port 3000

# O usar otro puerto
PORT=3001 npm run dev
```

---

## 📞 **Soporte**

Si tienes problemas:
1. **Revisa los logs** de Railway en el dashboard
2. **Verifica las variables** de entorno
3. **Consulta la documentación** de Railway: https://docs.railway.app/

**¡Tu base de datos en Railway está lista para producción!** 🎯

