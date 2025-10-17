# 🔧 CONFIGURACIÓN CORRECTA DE VARIABLES DE ENTORNO EN VERCEL

## ❌ **Problema Resuelto**

**Error**: `Environment Variable "TWILIO_ACCOUNT_SID" references Secret "twilio_account_sid", which does not exist`

**Causa**: Las variables de entorno estaban configuradas como referencias a secretos inexistentes en `vercel.json`

**Solución**: Eliminé las referencias a secretos del archivo `vercel.json`

## ✅ **Configuración Correcta**

### 1. **Archivo vercel.json** (Ya corregido)
```json
{
  "version": 2,
  "name": "fc-descansa-website",
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "backend/server.js": {
      "maxDuration": 30
    }
  }
}
```

### 2. **Configurar Variables de Entorno en Vercel Dashboard**

#### **Paso 1: Acceder al Dashboard**
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto "fc-descansa-website"
3. Ve a **Settings** → **Environment Variables**

#### **Paso 2: Agregar Variables de Entorno**

**Para Twilio (WhatsApp):**
- **Name**: `TWILIO_ACCOUNT_SID`
- **Value**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (tu Account SID)
- **Environment**: Production

- **Name**: `TWILIO_AUTH_TOKEN`
- **Value**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (tu Auth Token)
- **Environment**: Production

- **Name**: `TWILIO_WHATSAPP_NUMBER`
- **Value**: `+14155238886` (tu número de WhatsApp de Twilio)
- **Environment**: Production

**Para SendGrid (Email):**
- **Name**: `SENDGRID_API_KEY`
- **Value**: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (tu API Key)
- **Environment**: Production

- **Name**: `FROM_EMAIL`
- **Value**: `noreply@fcdescansa.com` (tu email de remitente)
- **Environment**: Production

- **Name**: `FROM_NAME`
- **Value**: `FC Descansa` (nombre del remitente)
- **Environment**: Production

### 3. **Obtener las Credenciales**

#### **Twilio (Para WhatsApp)**
1. Ve a [console.twilio.com](https://console.twilio.com)
2. Inicia sesión en tu cuenta
3. En el dashboard principal encontrarás:
   - **Account SID**: Comienza con "AC"
   - **Auth Token**: Token de autenticación
4. Para WhatsApp, activa el sandbox en **Messaging** → **Try it out** → **Send a WhatsApp message**

#### **SendGrid (Para Email)**
1. Ve a [app.sendgrid.com](https://app.sendgrid.com)
2. Inicia sesión en tu cuenta
3. Ve a **Settings** → **API Keys**
4. Crea una nueva API Key con permisos de **"Mail Send"**
5. Copia la API Key generada (comienza con "SG.")

### 4. **Desplegar**

Una vez configuradas todas las variables:

1. **Redespliega** tu proyecto en Vercel
2. **Verifica** que no aparezcan errores de variables de entorno
3. **Prueba** las notificaciones usando los endpoints de prueba

### 5. **Endpoints de Prueba**

Una vez desplegado, puedes probar las notificaciones:

```bash
# Probar sistema completo
GET https://tu-dominio.vercel.app/api/notifications/test

# Probar solo email
GET https://tu-dominio.vercel.app/api/notifications/test-sendgrid

# Probar solo WhatsApp
GET https://tu-dominio.vercel.app/api/notifications/test-twilio

# Enviar email de prueba
POST https://tu-dominio.vercel.app/api/notifications/test-email
{
  "to": "tu-email@ejemplo.com",
  "subject": "Prueba",
  "message": "Mensaje de prueba"
}

# Enviar WhatsApp de prueba
POST https://tu-dominio.vercel.app/api/notifications/test-whatsapp
{
  "to": "+1234567890",
  "message": "Mensaje de prueba"
}
```

## 🎯 **Resumen de la Solución**

1. ✅ **Eliminé** las referencias a secretos del `vercel.json`
2. ✅ **Configuré** solo `NODE_ENV` en el archivo
3. ✅ **Las variables** se configuran directamente en el dashboard de Vercel
4. ✅ **Sin conflictos** de configuración
5. ✅ **Despliegue** funcionará correctamente

## 🚀 **Próximos Pasos**

1. **Configura las variables** en Vercel Dashboard
2. **Redespliega** el proyecto
3. **Prueba las notificaciones** con los endpoints
4. **¡Disfruta** de las notificaciones funcionando!

**¡El problema está resuelto! Ahora puedes desplegar sin errores de variables de entorno.** 🎉
