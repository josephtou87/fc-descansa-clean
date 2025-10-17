# Configuración de Producción en Vercel - WhatsApp y Twilio

## Variables de Entorno Requeridas

Para habilitar las notificaciones de WhatsApp y email en producción, necesitas configurar las siguientes variables de entorno en tu dashboard de Vercel:

### 1. Twilio (WhatsApp)
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### 2. SendGrid (Email)
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@fcdescansa.com
FROM_NAME=FC Descansa
```

## Pasos para Configurar en Vercel

### 1. Acceder al Dashboard de Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto "fc-descansa-website"

### 2. Configurar Variables de Entorno
1. Ve a la pestaña "Settings"
2. Selecciona "Environment Variables" en el menú lateral
3. Agrega cada variable de entorno:

#### Para Twilio:
- **Name**: `TWILIO_ACCOUNT_SID`
- **Value**: Tu Account SID de Twilio (comienza con AC)
- **Environment**: Production

- **Name**: `TWILIO_AUTH_TOKEN`
- **Value**: Tu Auth Token de Twilio
- **Environment**: Production

- **Name**: `TWILIO_WHATSAPP_NUMBER`
- **Value**: Tu número de WhatsApp de Twilio (formato: +14155238886)
- **Environment**: Production

#### Para SendGrid:
- **Name**: `SENDGRID_API_KEY`
- **Value**: Tu API Key de SendGrid (comienza con SG.)
- **Environment**: Production

- **Name**: `FROM_EMAIL`
- **Value**: Tu email de remitente (ej: noreply@fcdescansa.com)
- **Environment**: Production

- **Name**: `FROM_NAME`
- **Value**: Nombre del remitente (ej: FC Descansa)
- **Environment**: Production

### 3. Redesplegar la Aplicación
1. Después de agregar todas las variables, ve a la pestaña "Deployments"
2. Haz clic en "Redeploy" en el último deployment
3. O haz un nuevo commit y push para activar un nuevo deployment

## Cómo Obtener las Credenciales

### Twilio
1. Ve a [twilio.com](https://twilio.com)
2. Crea una cuenta o inicia sesión
3. Ve a la consola de Twilio
4. Encuentra tu Account SID y Auth Token en el dashboard
5. Para WhatsApp, necesitas activar el sandbox de WhatsApp en Twilio

### SendGrid
1. Ve a [sendgrid.com](https://sendgrid.com)
2. Crea una cuenta o inicia sesión
3. Ve a Settings > API Keys
4. Crea una nueva API Key con permisos de "Mail Send"
5. Copia la API Key generada

## Endpoints de Prueba

Una vez configurado, puedes probar las notificaciones usando estos endpoints:

### Probar Email
```bash
POST https://tu-dominio.vercel.app/api/notifications/test-email
Content-Type: application/json

{
  "to": "tu-email@ejemplo.com",
  "subject": "Prueba de Email",
  "message": "Este es un mensaje de prueba"
}
```

### Probar WhatsApp
```bash
POST https://tu-dominio.vercel.app/api/notifications/test-whatsapp
Content-Type: application/json

{
  "to": "+1234567890",
  "message": "Este es un mensaje de prueba de WhatsApp"
}
```

### Probar Sistema Completo
```bash
GET https://tu-dominio.vercel.app/api/notifications/test
```

## Notas Importantes

1. **Twilio Sandbox**: Para desarrollo, Twilio usa un sandbox que requiere que los usuarios envíen un mensaje específico para activar la conversación.

2. **Límites de Twilio**: Revisa los límites de tu plan de Twilio para mensajes de WhatsApp.

3. **SendGrid**: Asegúrate de verificar tu dominio en SendGrid para evitar que los emails vayan a spam.

4. **Costos**: Tanto Twilio como SendGrid tienen costos por mensaje enviado. Revisa sus planes de precios.

## Solución de Problemas

### Error: "Twilio not configured"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el Account SID comience con "AC"

### Error: "SendGrid not configured"
- Verifica que la API Key comience con "SG."
- Asegúrate de que la API Key tenga permisos de "Mail Send"

### Los mensajes no llegan
- Para WhatsApp: Verifica que el número esté en el formato correcto (+1234567890)
- Para Email: Revisa la carpeta de spam
- Revisa los logs de Vercel para errores específicos

## Monitoreo

Puedes monitorear el estado de las notificaciones en:
- **Vercel Logs**: Dashboard > Functions > View Function Logs
- **Twilio Console**: Para ver el estado de los mensajes de WhatsApp
- **SendGrid Activity**: Para ver el estado de los emails enviados


