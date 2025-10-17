# FC DESCANSA - Sitio Web Oficial

## Descripción

Sitio web completo para el equipo de fútbol FC DESCANSA que incluye todas las funcionalidades solicitadas:

- **Página principal** con logo, próximo partido, contador regresivo y noticias
- **Estadísticas y resultados** con datos del equipo y partidos internacionales
- **Galería multimedia** con fotos y videos
- **Plantilla de jugadores** con validación de números y 11 titular interactivo
- **Sistema de registro e inicio de sesión** completo
- **Base de datos local** con archivos TXT simulados
- **Notificaciones automáticas** por email y WhatsApp
- **API de partidos en vivo** y resultados internacionales

## Características Principales

### 🏠 Página Principal
- Logo del equipo FC DESCANSA
- Información del próximo partido (fecha, hora, rival, cancha)
- Contador regresivo en tiempo real
- Sección de últimas noticias del equipo

### 📊 Estadísticas y Resultados
- Estadísticas del equipo (partidos jugados, goles, victorias)
- Resultados de partidos pasados con marcadores
- Resultados internacionales (Champions League y Liga MX)
- Sistema de pestañas para diferentes competencias

### 📸 Multimedia
- Galería de fotos de partidos y entrenamientos
- Sección de videos con reproductor
- Modal para visualización ampliada de imágenes
- Interfaz responsive y moderna

### 👥 Plantilla de Jugadores
- Jugadores organizados por posición (Porteros, Defensas, Centrocampistas, Delanteros)
- Ficha completa de cada jugador (nombre, apodo, número, foto, estadísticas)
- Validación de números de camiseta disponibles
- 11 titular mostrado en terreno de juego interactivo
- Información del director técnico

### 🔐 Sistema de Autenticación
- Formulario de registro completo con validaciones
- Inicio de sesión seguro
- Recuperación de contraseña por email
- Captura de fotos con cámara web
- Validación de datos en tiempo real

### 📱 Notificaciones (Producción)
- **WhatsApp**: Integración con Twilio para notificaciones automáticas
- **Email**: Integración con SendGrid para notificaciones por correo
- **Configuración**: Variables de entorno para Vercel
- **Pruebas**: Endpoints de testing para verificar funcionamiento

### 💾 Base de Datos
- **Producción**: PostgreSQL en Railway (500MB gratuitos)
- **Desarrollo**: Base de datos local o Railway
- **Respaldo**: localStorage del navegador como fallback
- **Exportación**: Datos a archivos de texto

### 📱 Notificaciones
- Notificaciones por email y WhatsApp
- Recordatorios automáticos de partidos
- Sistema de configuración de servicios
- Historial de notificaciones enviadas

### 🌐 API de Fútbol
- Integración con APIs de fútbol para partidos en vivo
- Resultados de Champions League y Liga MX
- Sistema de caché para optimizar rendimiento
- Datos mock para demostración

## Estructura del Proyecto

```
fc.descansa.renace/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica principal de la aplicación
├── database.js         # Gestión de base de datos
├── api.js             # Integración con APIs externas
└── README.md          # Documentación
```

## Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Node.js v16 o superior
- Cuenta de GitHub (para Railway)
- JavaScript habilitado

### 🚀 Instalación Rápida con Railway
```bash
# 1. Clonar el proyecto
git clone [tu-repo]
cd fc.descansa.renace

# 2. Setup automático de Railway
node setup-railway.js

# 3. Configurar base de datos
cd backend
node setup-database.js

# 4. Iniciar servidor
npm run dev
```

### 📖 Instalación Manual
1. **Configura Railway**: Sigue `RAILWAY_SETUP_GUIDE.md`
2. **Instala dependencias**: `cd backend && npm install`
3. **Configura variables**: Crea `backend/.env` con tus credenciales
4. **Inicia servidor**: `npm run dev`
5. **Abre la app**: `http://localhost:3000`

### Configuración de APIs (Opcional)
Para funcionalidades completas de notificaciones y partidos en vivo:

1. **API de Fútbol**: Obtén una API key de [Football-Data.org](https://www.football-data.org/)
2. **Email Service**: Configura SendGrid, Mailgun o similar
3. **WhatsApp API**: Configura WhatsApp Business API
4. **Weather API**: Obtén una API key de [OpenWeatherMap](https://openweathermap.org/)

## Funcionalidades Detalladas

### Registro de Jugadores
- **Campos requeridos**: Nombre completo, número de camiseta, posición, email, WhatsApp, contraseña
- **Campos opcionales**: Apodo, foto
- **Validaciones**:
  - Email con formato válido
  - WhatsApp con formato internacional
  - Número de camiseta único (1-99)
  - Contraseña segura

### Gestión de Partidos
- Crear nuevos partidos
- Actualizar resultados
- Envío automático de notificaciones
- Recordatorios programados

### Estadísticas de Jugadores
- Goles marcados
- Asistencias
- Partidos jugados
- Tarjetas amarillas/rojas
- Actualización automática

### 11 Titular
- Formación 4-3-3 por defecto
- Posicionamiento visual en el campo
- Información de cada jugador al hacer clic
- Actualización automática según plantilla

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript ES6+**: Lógica de la aplicación
- **LocalStorage**: Persistencia de datos
- **Fetch API**: Comunicación con APIs externas
- **WebRTC**: Captura de fotos con cámara
- **Responsive Design**: Compatible con móviles y tablets

## Datos de Ejemplo

La aplicación incluye datos de ejemplo:
- 4 jugadores registrados
- 2 partidos (1 finalizado, 1 programado)
- 2 noticias del equipo
- Estadísticas básicas del equipo

## Personalización

### Cambiar Logo del Equipo
Reemplaza la imagen del logo en el HTML:
```html
<img src="tu-logo-aqui.png" alt="FC DESCANSA Logo" class="logo">
```

### Modificar Colores
Edita las variables CSS en `styles.css`:
```css
:root {
    --primary-color: #1e40af;
    --secondary-color: #3b82f6;
    --accent-color: #059669;
}
```

### Configurar Notificaciones

#### Para Desarrollo Local
Modifica la configuración en `api.js`:
```javascript
window.NotificationService.configureEmailService({
    apiKey: 'tu-api-key',
    from: 'tu-email@dominio.com'
});
```

#### Para Producción (Vercel)
1. **Configura variables de entorno en Vercel Dashboard:**
   - `TWILIO_ACCOUNT_SID`: Tu Account SID de Twilio
   - `TWILIO_AUTH_TOKEN`: Tu Auth Token de Twilio
   - `TWILIO_WHATSAPP_NUMBER`: Tu número de WhatsApp de Twilio
   - `SENDGRID_API_KEY`: Tu API Key de SendGrid
   - `FROM_EMAIL`: Email de remitente
   - `FROM_NAME`: Nombre del remitente

2. **Usa el script de configuración:**
   ```bash
   node setup-vercel-env.js
   ```

3. **Prueba las notificaciones:**
   ```bash
   node test-production-notifications.js
   ```

📚 **Documentación completa**: Ver `VERCEL_PRODUCTION_SETUP.md`

## Soporte y Mantenimiento

### Respaldo de Datos
- Los datos se guardan automáticamente en localStorage
- Exporta datos usando la función `exportToTextFiles()`
- Respaldos regulares recomendados

### Actualizaciones
- Modifica datos directamente en la interfaz
- Los cambios se guardan automáticamente
- Reinicia la página para ver cambios

### Troubleshooting
- **Problemas de cámara**: Verifica permisos del navegador
- **Datos no se guardan**: Verifica que localStorage esté habilitado
- **APIs no funcionan**: Usa datos mock incluidos

## Características Futuras

- [ ] Integración con redes sociales
- [ ] Sistema de comentarios en noticias
- [ ] Estadísticas avanzadas con gráficos
- [ ] Aplicación móvil nativa
- [ ] Sistema de tienda online
- [ ] Chat en tiempo real
- [ ] Streaming de partidos

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Contacto

Para soporte técnico o consultas sobre el proyecto:
- Email: info@fcdescansa.com
- WhatsApp: +52 123 456 7890

---

**FC DESCANSA** - Somos más que un equipo, somos una familia unida por la pasión del fútbol. ⚽
