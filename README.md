# 🚲 SanSah Bikes — Proyecto Multirepositorio

Este proyecto comprende la suite completa de sistemas para la gestión, venta y presencia en línea de **SanSah Bikes**. Está estructurado como un proyecto multirepositorio que incluye una página de aterrizaje, tienda para clientes, panel de administración para personal interno y una API en Node.js de alto rendimiento conectada a una base de datos PostgreSQL.

---

## 📁 Estructura del Proyecto

El repositorio está dividido en los siguientes módulos independientes:

```bash
SanSah/
├── admin/       # Panel de administración (Vue 3 + Vite + Tailwind CSS)
├── client/      # Aplicación e interfaz de la tienda para clientes (React + Vite)
├── landing/     # Página de aterrizaje del negocio (Vue 3 + Vite + TypeScript)
└── server/      # Servidor Backend API (Express.js + Prisma ORM + PostgreSQL)
```

---

## 🛠️ Tecnologías Utilizadas por Módulo

### 1. 🖥️ **Admin** (`/admin`)
Panel de administración web interno para la gestión de productos, inventario, ventas, compras, caja y estadísticas de taller y POS.
*   **Framework:** Vue 3 (Composition API)
*   **Herramienta de Construcción:** Vite + TypeScript
*   **Estilos:** Tailwind CSS (Diseño Premium Dark/Light)
*   **Gráficos:** ApexCharts para estadísticas visuales
*   **Funcionalidades Clave:**
    *   Generación de facturas de compras y actualización inteligente de existencias.
    *   Módulo POS de caja rápida y control del taller de reparaciones.
    *   Visualizador dinámico de cortes de caja diario y métodos de pago.

### 2. 👤 **Client** (`/client`)
Sitio web interactivo orientado al cliente final para explorar el catálogo y comprar componentes/bicicletas.
*   **Framework:** React
*   **Herramienta de Construcción:** Vite
*   **Librerías principales:** Axios, React Router Dom

### 3. 🌐 **Landing** (`/landing`)
Página institucional y de contacto promocional de SanSah Bikes.
*   **Framework:** Vue 3 + TypeScript
*   **Herramienta de Construcción:** Vite

### 4. 🗄️ **Server** (`/server`)
API RESTful centralizada que provee servicios a todos los frontends y conecta con la base de datos PostgreSQL.
*   **Entorno:** Node.js + Express
*   **Base de Datos:** PostgreSQL
*   **ORM:** Prisma Client
*   **Seguridad:** BcryptJS para encriptación y JWT (JSON Web Tokens) para sesiones
*   **Pasarelas Integradas:** Mercado Pago para cobros en línea

---

## 🚀 Configuración y Ejecución Local

### Prerrequisitos
*   **Node.js** (Versión 18 o superior recomendada)
*   **PostgreSQL** (Servicio local de base de datos o conexión externa)

### Paso 1: Configurar Variables de Entorno
Crea un archivo `.env` dentro de la carpeta `server/` tomando como referencia lo siguiente:

```env
# URL de conexión a la base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/sansah_db?schema=public"

# Clave secreta para la firma de JSON Web Tokens (JWT)
JWT_SECRET="clave_secreta_super_segura_sansah"

# URL del Frontend (opcional para CORS)
FRONTEND_URL="http://localhost:5173"
```

### Paso 2: Inicializar la Base de Datos
Accede al directorio del servidor, instala dependencias, sincroniza el esquema con PostgreSQL y genera el cliente de Prisma:

```bash
cd server
npm install
npx prisma db push
npx prisma generate
```

### Paso 3: Ejecución de Módulos en Desarrollo

Abre terminales independientes para cada sección que desees levantar:

#### Levantar el Backend Server (Puerto 3000 por defecto)
```bash
cd server
npm run dev
```

#### Levantar el Panel de Administración (Puerto 5173 por defecto)
```bash
cd admin
npm install
npm run dev
```

#### Levantar la Tienda del Cliente
```bash
cd client
npm install
npm run dev
```

#### Levantar la Landing Page
```bash
cd landing
npm install
npm run dev
```

---

## 🔒 Autenticación en el Administrador
Para iniciar sesión en el panel `/admin`, el endpoint permite credenciales flexibles:
*   Puedes usar indistintamente tu **Correo Electrónico** o tu **Nombre de Usuario** (ej. `"Yael"` o `"yay@ejemplo.com"`).
*   La búsqueda de usuario es insensible a mayúsculas y minúsculas para mayor comodidad del personal.
