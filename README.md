Habit Tracker – Semana 6

Descripción:
Este proyecto consiste en una aplicación web para gestionar hábitos diarios, inspirada en el concepto del libro Hábitos Atómicos. La idea principal es que el usuario pueda crear hábitos, darles seguimiento día a día y visualizar su progreso hasta alcanzar una meta de 66 días.

La aplicación permite registrar usuarios, iniciar sesión, agregar hábitos y marcarlos como completados. Si un hábito no se completa en un día, la racha se reinicia automáticamente.

Tecnologías utilizadas:
Frontend: Next.js
Backend: Express.js
Base de datos: MongoDB (Atlas)
Autenticación: JSON Web Tokens (JWT)
Despliegue: Vercel
Funcionalidades principales
Registro de usuario
Inicio de sesión
Creación de hábitos
Marcado de hábitos como completados (una vez por día)
Sistema de racha (streak)
Barra de progreso basada en los días completados
Cierre de sesión (logout)

Cómo funciona:
Una vez el usuario se registra e inicia sesión, puede agregar hábitos personalizados. Cada hábito puede marcarse como completado una vez al día.
El sistema calcula la racha dependiendo de si el hábito se completa de forma continua. Si se omite un día, la racha se reinicia.
El progreso se representa mediante una barra que aumenta conforme el usuario se acerca al objetivo de 66 días.

Estructura del proyecto:
El proyecto está dividido en dos partes:

Backend: API desarrollada con Express.js que maneja autenticación, usuarios y hábitos

Frontend: Aplicación en Next.js que consume la API y muestra la interfaz al usuario
Despliegue

El proyecto fue desplegado utilizando Vercel:
Frontend: habit-tracker-frontend-olive-delta.vercel.app
Backend: habit-tracker-backend-two.vercel.app

Repositorios
Frontend: https://github.com/LuzCosajay/habit-tracker-frontend
Backend: https://github.com/LuzCosajay/habit-tracker-backend

Notas finales
Durante el desarrollo se trabajó con autenticación, conexión a base de datos en la nube y despliegue en producción. Se presentaron algunos retos relacionados con configuración de CORS y acceso a MongoDB Atlas, los cuales fueron solucionados para lograr una aplicación funcional.
