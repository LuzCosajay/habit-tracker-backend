# Habit Tracker - Backend (Semana 3)

Backend desarrollado con Node.js, Express y MongoDB Atlas para la gestión de hábitos.

Este proyecto corresponde a la entrega de la Semana 3 del curso de Programación Avanzada.

------------------------------------------------------------

TECNOLOGÍAS UTILIZADAS

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Dotenv
- CORS
- bcryptjs
- Nodemon

------------------------------------------------------------

REQUISITOS PREVIOS

- Node.js instalado
- Cuenta en MongoDB Atlas
- Cadena de conexión a la base de datos en un archivo `.env`

------------------------------------------------------------

CONFIGURACIÓN DEL PROYECTO

1. Clonar el repositorio:

git clone https://github.com/LuzCosajay/habit-tracker-backend.git

2. Entrar a la carpeta del proyecto:

cd habit-tracker-backend

3. Instalar dependencias:

npm install

4. Crear un archivo llamado `.env` en la raíz del proyecto con el siguiente contenido:

MONGO_URI=TU_CADENA_DE_CONEXION_MONGODB_ATLAS

------------------------------------------------------------

EJECUCIÓN DEL PROYECTO

Para iniciar el servidor en modo desarrollo:

npm run dev

El servidor se ejecutará en:

http://localhost:3001

------------------------------------------------------------

FUNCIONALIDADES IMPLEMENTADAS EN SEMANA 3

- Registro de usuarios
- Login de usuarios
- Hash de contraseña con bcryptjs
- Crear hábitos
- Obtener todos los hábitos
- Actualizar nombre del hábito
- Eliminar hábito
- Marcar hábito como realizado con botón Done
- Seguimiento de racha de días
- Reinicio de racha cuando no se cumple el hábito en el día correspondiente

------------------------------------------------------------

ENDPOINTS DISPONIBLES

1. Ruta de prueba

GET /

Respuesta:
Servidor funcionando correctamente 🚀

------------------------------------------------------------

2. Registro de usuario

POST /auth/register

Body (JSON):
{
  "name": "Luz",
  "email": "luz@test.com",
  "password": "123456"
}

------------------------------------------------------------

3. Login de usuario

POST /auth/login

Body (JSON):
{
  "email": "luz@test.com",
  "password": "123456"
}

------------------------------------------------------------

4. Crear hábito

POST /habits

Body (JSON):
{
  "name": "Estudiar 1 hora"
}

------------------------------------------------------------

5. Obtener hábitos

GET /habits

Devuelve la lista completa de hábitos guardados.

------------------------------------------------------------

6. Actualizar hábito

PUT /habits/:id

Body (JSON):
{
  "name": "Leer 20 minutos"
}

------------------------------------------------------------

7. Marcar hábito como realizado

PUT /habits/:id/done

Esta ruta actualiza la racha del hábito:
- Si ya fue marcado hoy, no vuelve a sumar
- Si fue marcado ayer, suma 1 a la racha
- Si pasaron más días, reinicia la racha a 1

------------------------------------------------------------

8. Eliminar hábito

DELETE /habits/:id

------------------------------------------------------------

ESTRUCTURA PRINCIPAL DEL PROYECTO

.
├── models/
│   ├── Habit.js
│   └── User.js
├── index.js
├── package.json
└── .env (no incluido en el repositorio)

------------------------------------------------------------

NOTAS IMPORTANTES

- La contraseña de los usuarios se almacena encriptada mediante bcryptjs.
- El archivo `.env` no se incluye en el repositorio por seguridad.
- La base de datos utilizada es MongoDB Atlas.
- Este proyecto corresponde a la entrega de la Semana 3.
