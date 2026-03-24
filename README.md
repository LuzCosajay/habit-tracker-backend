# Habit Tracker - Backend (Semana 5)

Este proyecto corresponde a la entrega de la Semana 5 del curso de Programación Avanzada.

Se desarrolló un backend utilizando Node.js, Express y MongoDB Atlas, incorporando autenticación con JWT, validación de usuarios y protección de rutas mediante middleware.

---

## Tecnologías utilizadas

- Node.js  
- Express.js  
- MongoDB Atlas  
- Mongoose  
- bcryptjs  
- jsonwebtoken (JWT)  
- dotenv  
- cors  
- nodemon  

---

## Descripción general

En esta etapa se implementó un sistema de autenticación para permitir que los usuarios puedan registrarse, iniciar sesión y acceder a funcionalidades protegidas.

El sistema genera un token JWT al iniciar sesión, el cual es utilizado para autorizar las peticiones hacia el backend. Este token es validado mediante un middleware antes de permitir el acceso a las rutas protegidas.

Además, se mantiene la funcionalidad del sistema de hábitos, incluyendo el seguimiento de rachas y el control de progreso.

---

## Funcionalidades implementadas

- Registro de usuarios con contraseña encriptada  
- Inicio de sesión con generación de token JWT  
- Middleware para validación de token  
- Protección de rutas mediante autorización  
- Creación de hábitos (requiere autenticación)  
- Obtención de hábitos (requiere autenticación)  
- Marcado de hábitos como completados  
- Seguimiento de racha de días  
- Reinicio de racha si no se cumple el hábito  

---

## Autenticación

Al iniciar sesión, el servidor genera un token JWT con información básica del usuario.

Este token debe enviarse en cada petición al backend en el header:

Authorization: Bearer TOKEN

El backend valida este token antes de permitir el acceso a las rutas protegidas.

---

## Endpoints principales

### Autenticación

POST /auth/register  
Permite registrar un nuevo usuario.

POST /auth/login  
Valida las credenciales y devuelve un token JWT.

---

### Hábitos (rutas protegidas)

GET /habits  
Obtiene la lista de hábitos.

POST /habits  
Crea un nuevo hábito.

PUT /habits/:id/done  
Marca un hábito como completado y actualiza la racha.

PUT /habits/:id  
Actualiza el nombre del hábito.

DELETE /habits/:id  
Elimina un hábito.

---

## Ejecución del proyecto

1. Clonar el repositorio:

git clone https://github.com/LuzCosajay/habit-tracker-backend.git

2. Ingresar a la carpeta:

cd habit-tracker-backend

3. Instalar dependencias:

npm install

4. Crear archivo `.env` en la raíz del proyecto:

MONGO_URI=tu_cadena_de_conexion  
JWT_SECRET=tu_clave_secreta  

5. Ejecutar el servidor:

npm run dev

Servidor disponible en:

http://localhost:3001

---

## Estructura del proyecto

habit-tracker-backend/

models/  
- Habit.js  
- User.js  

index.js  
package.json  
.env (no incluido en el repositorio)

---

## Notas

- Las contraseñas se almacenan encriptadas utilizando bcrypt.  
- El archivo `.env` no se incluye en el repositorio por seguridad.  
- El acceso a las rutas de hábitos requiere autenticación mediante JWT.  
- El frontend actual implementa el flujo de registro, login, creación de hábitos y marcado como completados.  
