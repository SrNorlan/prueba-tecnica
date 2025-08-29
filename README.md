# Prueba Técnica – Frontend (Next.js + Tailwind)

Este proyecto implementa un **sistema bancario web** siguiendo el diseño de Figma y los requerimientos de la prueba técnica.  
Se construyó con **Next.js (App Router)**, **React** y **TailwindCSS**, priorizando el uso de **componentes reutilizables** y un **estado global centralizado**.

---

## 🚀 Tecnologías usadas
- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/) (estilos utilitarios)
- Context API de React (estado global)
- API Mock con [Mockoon CLI](https://mockoon.com/)

---

## ⚙️ Requisitos
- Node.js **v18+**
- NPM o Yarn
- Repositorio de la API mock proporcionado para la prueba técnica

---

## ▶️ Instrucciones de ejecución

### 1. Clonar este repositorio (frontend)
```bash
git clone https://github.com/prueba-tecnica.git
cd prueba-tecnica

### 2. Clonar tambien el repositorio de la API mock

git clone https://github.com/frontend-mobile-challenge-mock.git
cd frontend-mobile-challenge-mock
npm install
npm run start-mock

Esto expone la API en http://127.0.0.1:5566.

Es obligatorio levantar la API mock antes de iniciar el frontend.

### 3. Volver al proyecto frontend e instalar dependencias

cd ../prueba-tecnica
npm install

### 4. Configurar variables de entorno

El archivo .env.local no está incluido en el repositorio (omitido intencionalmente).
Debes crearlo en la raíz con este contenido:

NEXT_PUBLIC_API_URL=http://127.0.0.1:5566

### 5. Levantar el frontend

npm run dev
abrir en el navegador http://localhost:3000

** AHORA SE MOSTRARAN LOS DETALLE DE LA APLICACION WEB QUE SE CONSTRUYO **

* Pantallas implementadas

Dashboard

Tarjetas (una por cuenta del usuario)

Cuentas con saldo

Transacciones recientes (mock + transacciones locales al instante)

Transferencias

Flujo en 4 pasos (Cuenta origen → Cuenta destino → Datos → Confirmación)

Validaciones: saldo suficiente, no montos negativos, no misma cuenta

Resumen antes de confirmar

Al confirmar: se actualizan saldos y se registra la transacción en el estado global

Mis transacciones

Listado de todos los movimientos (mock + locales)

Filtro por rango de fechas

Campos: fecha, descripción, débito/crédito y balance actualizado

* Estado global (Context API)

Se implementó un contexto global (context/BankContext.jsx) que:

Carga las cuentas y transacciones iniciales desde la API mock.

Mantiene consistencia de saldos al ejecutar transferencias.

Registra transacciones locales adicionales en memoria.

Permite que tanto Dashboard como Mis Transacciones reflejen cambios al instante.

Esto cumple con el requisito de gestionar el estado global de la aplicación.

