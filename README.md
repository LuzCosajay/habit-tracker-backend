# Habit Tracker - Backend (Semana 1)

API desarrollada en Express.js con conexión a MongoDB Atlas para la gestión de hábitos.

Este proyecto corresponde a la entrega de la Semana 1 del curso de Programación Avanzada.

------------------------------------------------------------

TECNOLOGÍAS UTILIZADAS

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Dotenv
- CORS

------------------------------------------------------------

REQUISITOS PREVIOS

- Node.js instalado
- Cuenta en MongoDB Atlas
- Cadena de conexión (MONGO_URI)

------------------------------------------------------------

CONFIGURACIÓN DEL PROYECTO

1. Clonar el repositorio:

git clone https://github.com/LuzCosajay/habit-tracker-backend.git

2. Entrar a la carpeta del proyecto:

cd habit-tracker-backend

3. Instalar dependencias:

npm install

4. Crear un archivo llamado .env en la raíz del proyecto con el siguiente contenido:

MONGO_URI=TU_CADENA_DE_CONEXION_MONGODB_ATLAS

------------------------------------------------------------

EJECUCIÓN

Iniciar el servidor:

node index.js

El servidor se ejecutará en:

http://localhost:3001

------------------------------------------------------------

ENDPOINTS DISPONIBLES

1. Ruta de prueba

GET /
Devuelve un mensaje confirmando que el servidor funciona.

------------------------------------------------------------

2. Crear hábito

POST /habits

Body (JSON):
{
  "name": "Nombre del hábito"
}

------------------------------------------------------------

3. Obtener todos los hábitos

GET /habits

Devuelve la lista completa de hábitos almacenados en la base de datos.

------------------------------------------------------------

4. Actualizar hábito

PUT /habits/:id

Body (JSON):
{
  "name": "Nuevo nombre",
  "isActive": true
}

------------------------------------------------------------

5. Eliminar hábito

DELETE /habits/:id

------------------------------------------------------------

ESTRUCTURA PRINCIPAL

.
├── models/
│   └── Habit.js
├── index.js
├── package.json
└── .env (no incluido en el repositorio)

------------------------------------------------------------

NOTAS IMPORTANTES

- La base de datos utilizada es MongoDB Atlas.
- El archivo .env no se incluye en el repositorio por seguridad.
- Este proyecto corresponde a la entrega de la Semana 1.
