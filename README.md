# 🎬 Sinapsis SMS Campaign System

<div align="center">

![Sinapsis Banner](https://img.shields.io/badge/Sinapsis-SMS%20Campaign%20System-6366f1?style=for-the-badge&logo=message-square&logoColor=white)

**Sistema Enterprise de Gestión de Campañas SMS con Interfaz Cinematográfica**

[![Angular](https://img.shields.io/badge/Angular-20.0.0-DD0031?style=flat-square&logo=angular)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com/)
[![Serverless](https://img.shields.io/badge/Serverless-Framework-FD5750?style=flat-square&logo=serverless)](https://serverless.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org/)

</div>

## 🌟 Características Principales

- 🎨 **Interfaz Épica Cinematográfica** - Diseño premium inspirado en Notion, Linear y Figma
- 🚀 **Architecture Serverless** - AWS Lambda + Node.js para escalabilidad infinita
- ⚡ **Frontend Angular 20** - Última versión con Angular Material y Lucide Icons
- 🗄️ **Base de Datos MySQL** - Optimizada para alta performance
- 📱 **100% Responsive** - Funciona perfectamente en móvil, tablet y desktop
- 🔐 **Seguridad Enterprise** - Validación robusta y manejo seguro de datos
- 📊 **Analytics Avanzados** - Métricas detalladas de campañas y mensajes
- 🎯 **OpenAPI Documentation** - API completamente documentada

## 🏗️ Arquitectura del Sistema

- **Frontend**: Angular 20.0.0 + Angular Material + Lucide Icons
- **Backend**: Node.js + Serverless Framework + AWS Lambda
- **Base de Datos**: MySQL 8.0 (Dockerizada)
- **API**: REST con documentación OpenAPI 3.0
- **Deployment**: AWS Lambda + Docker + GitHub Actions

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** 18+ y npm
- **Docker** y Docker Compose
- **Git**

### 1. 📦 Clonación del Proyecto

```bash
git clone https://github.com/tu-usuario/sinapsis_project.git
cd sinapsis_project
```

### 2. 🗄️ Configuración de Base de Datos

```bash
cd database
docker-compose up -d

# Verificar que MySQL esté funcionando
docker-compose ps
```

**Credenciales de Base de Datos:**
- **Host:** localhost:3306
- **Usuario:** `sinapsis_user`
- **Contraseña:** `sinapsis_password`
- **Base de Datos:** `sinapsis_db`
- **phpMyAdmin:** http://localhost:8080

### 3. 🔧 Configuración del Backend

```bash
cd server
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### 4. 🎨 Configuración del Frontend

```bash
cd user
npm install

# Ejecutar en modo desarrollo
npm start
```

### 5. 🌐 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:4200 | Interfaz de usuario principal |
| **Backend API** | http://localhost:3000 | API REST endpoints |
| **OpenAPI Docs** | http://localhost:3000/docs | Documentación interactiva |
| **phpMyAdmin** | http://localhost:8080 | Administración de BD |

## 📁 Estructura del Proyecto

```
sinapsis_project/
├── 📱 user/                 # Frontend Angular 20
│   ├── src/app/components/
│   │   ├── campaign-list/    # 🎬 Lista épica de campañas
│   │   ├── campaign-detail/  # 🎯 Detalles cinematográficos
│   │   ├── campaign-form/    # ✨ Formulario premium
│   │   └── message-list/     # 📊 Analytics de mensajes
│   └── package.json
│
├── 🚀 server/               # Backend Node.js Serverless
│   ├── src/handlers/        # Lambda Functions
│   ├── src/services/        # Business Logic
│   └── serverless.yml      # Serverless Configuration
│
├── 🗄️ database/            # MySQL Database
│   ├── docker-compose.yml  # Docker Configuration
│   └── init/               # Initial Scripts
│
└── README.md               # Project Documentation
```

## 🎬 Características de la Interfaz

### ✨ Diseño Cinematográfico

- **Hero Headers** con gradientes animados y efectos glassmórficos
- **Floating Elements** con animaciones de profundidad 3D
- **Premium Cards** con efectos de hover y escalado suave
- **Glassmorphism UI** con transparencias y blur effects
- **Gradient Animations** y transiciones cinematográficas
- **Epic Buttons** con efectos de sweep y transformaciones
- **Responsive Design** adaptado para todas las pantallas

### 🎯 Componentes Principales

| Componente | Descripción | Características |
|------------|-------------|-----------------|
| **Campaign List** | Lista principal de campañas | 🎨 Hero header, filtros avanzados, estadísticas |
| **Campaign Detail** | Vista detallada de campaña | 📊 Analytics, progreso visual, acciones premium |
| **Campaign Form** | Formulario de creación | ✨ Secciones glassmórficas, validación avanzada |
| **Message List** | Listado de mensajes | 📱 Vista optimizada, filtros, exportación |

## 📊 API Endpoints

### 🏷️ Campañas

```http
GET    /api/campaigns              # Listar campañas con filtros
POST   /api/campaigns              # Crear nueva campaña
GET    /api/campaigns/{id}         # Obtener campaña específica
POST   /api/campaigns/{id}/process # Procesar/enviar campaña
```

### 📱 Mensajes

```http
GET    /api/campaigns/{id}/messages  # Mensajes de una campaña
GET    /api/messages/{id}            # Detalle de mensaje específico
```

### 👥 Usuarios

```http
GET    /api/users                   # Listar usuarios
POST   /api/users                   # Crear usuario
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 20.0.0** - Framework principal
- **Angular Material** - Componentes UI
- **Lucide Angular** - Iconografía premium
- **Tailwind CSS** - Utilidades de estilo
- **TypeScript 5.0+** - Lenguaje principal
- **RxJS** - Programación reactiva

### Backend
- **Node.js 20+** - Runtime de JavaScript
- **Serverless Framework** - Deploy y gestión
- **Express.js** - Framework web
- **MySQL 8.0** - Base de datos relacional
- **OpenAPI 3.0** - Documentación de API

### DevOps & Tools
- **Docker** - Containerización
- **AWS Lambda** - Serverless compute
- **GitHub Actions** - CI/CD
- **ESLint** - Linting de código

## 🔧 Scripts Disponibles

### Frontend (user/)
```bash
npm start              # Desarrollo con hot reload
npm run build          # Build para producción
npm run test           # Ejecutar tests unitarios
npm run lint           # Linting del código
```

### Backend (server/)
```bash
npm run dev            # Desarrollo local
npm run offline        # Serverless offline
npm run deploy         # Deploy a AWS
npm run test           # Ejecutar tests
```

### Database (database/)
```bash
docker-compose up -d           # Iniciar base de datos
docker-compose down            # Detener base de datos
docker-compose logs -f mysql   # Ver logs de MySQL