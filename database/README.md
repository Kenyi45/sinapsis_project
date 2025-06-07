# Base de Datos Sinapsis - MySQL Dockerizada

## 📋 Descripción

Este directorio contiene la configuración de Docker para la base de datos MySQL del proyecto Sinapsis, incluyendo las tablas necesarias para el sistema de campañas de mensajería.

**✨ NUEVA CARACTERÍSTICA: Configuración UTF-8**
La base de datos ahora está configurada con charset `utf8mb4` y collation `utf8mb4_unicode_ci` para soporte completo de caracteres Unicode, incluyendo emojis y caracteres especiales.

## 🗃️ Estructura de la Base de Datos

### Tablas creadas:

1. **customers** - Gestión de clientes
   - `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
   - `name` (VARCHAR(255), NOT NULL)
   - `status` (BOOLEAN, DEFAULT TRUE)
   - `created_at`, `updated_at` (TIMESTAMP)

2. **users** - Usuarios del sistema
   - `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
   - `customer_id` (INT, FOREIGN KEY -> customers.id)
   - `username` (VARCHAR(255), UNIQUE, NOT NULL)
   - `status` (BOOLEAN, DEFAULT TRUE)
   - `created_at`, `updated_at` (TIMESTAMP)

3. **campaigns** - Campañas de mensajería
   - `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
   - `user_id` (INT, FOREIGN KEY -> users.id)
   - `name` (VARCHAR(255), NOT NULL)
   - `process_date` (DATE, NOT NULL)
   - `process_hour` (TIME, NOT NULL)
   - `process_status` (INT, DEFAULT 0)
   - `phone_list` (VARCHAR(255))
   - `message_text` (TEXT)
   - `created_at`, `updated_at` (TIMESTAMP)

4. **messages** - Mensajes enviados
   - `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
   - `campaign_id` (INT, FOREIGN KEY -> campaigns.id)
   - `phone` (VARCHAR(20), NOT NULL)
   - `text` (TEXT)
   - `shipping_status` (INT, DEFAULT 0)
   - `process_date` (DATE, NOT NULL)
   - `process_hour` (TIME, NOT NULL)
   - `created_at`, `updated_at` (TIMESTAMP)

## 🚀 Comandos para iniciar el contenedor

### 1. Iniciar los servicios
```bash
cd database
docker-compose up -d
```

### 2. Verificar que los contenedores estén corriendo
```bash
docker-compose ps
```

### 3. Ver los logs (opcional)
```bash
docker-compose logs -f mysql
```

### 4. Acceder a MySQL desde línea de comandos
```bash
docker exec -it sinapsis_mysql mysql -u root -p
# Contraseña: rootpassword
```

### 5. Acceder a phpMyAdmin
Abrir en el navegador: http://localhost:8080
- **Usuario:** root
- **Contraseña:** rootpassword

## 🛑 Comandos para detener y limpiar

### Detener los servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ Elimina todos los datos)
```bash
docker-compose down -v
```

### Reconstruir las imágenes
```bash
docker-compose up --build -d
```

## 📊 Credenciales de la Base de Datos

- **Host:** localhost
- **Puerto:** 3306
- **Base de datos:** sinapsis_db
- **Usuario root:** root / rootpassword
- **Usuario aplicación:** sinapsis_user / sinapsis_password

## 🔧 Variables de Entorno

Las siguientes variables están configuradas en el docker-compose.yml:

```
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=sinapsis_db
MYSQL_USER=sinapsis_user
MYSQL_PASSWORD=sinapsis_password
```

## 📝 Notas Importantes

1. El archivo `init.sql` se ejecuta automáticamente al crear el contenedor por primera vez
2. Los datos se persisten en un volumen Docker llamado `mysql_data`
3. phpMyAdmin está disponible para administración web de la base de datos
4. Las tablas incluyen datos de ejemplo para testing 

## 🌐 Configuración UTF-8

### Características UTF-8 implementadas:
- **Charset del servidor:** utf8mb4
- **Collation del servidor:** utf8mb4_unicode_ci
- **Charset de la base de datos:** utf8mb4
- **Charset de todas las tablas:** utf8mb4
- **Soporte completo para:** Emojis, caracteres especiales, acentos, ñ, etc.

### 🔄 Comandos para actualizar la base de datos a UTF-8

#### Opción 1: Base de datos nueva (elimina datos existentes)
```bash
cd database
# Ejecutar el script de actualización completa
update_database.bat
```

#### Opción 2: Migrar base de datos existente (conserva datos)
```bash
cd database
# Ejecutar el script de migración
migrate_existing_db.bat
```

#### Opción 3: Comandos manuales paso a paso

**Para base de datos nueva:**
```bash
# 1. Detener contenedores
docker-compose down

# 2. Eliminar volumen (CUIDADO: borra datos)
docker volume rm database_mysql_data

# 3. Iniciar con nueva configuración UTF-8
docker-compose up -d

# 4. Verificar configuración UTF-8
docker exec sinapsis_mysql mysql -u root -prootpassword -e "SHOW VARIABLES LIKE 'character_set%';"
```

**Para migrar base de datos existente:**
```bash
# 1. Crear backup
docker exec sinapsis_mysql mysqldump -u root -prootpassword sinapsis_db > backup_sinapsis_db.sql

# 2. Ejecutar migración
docker exec -i sinapsis_mysql mysql -u root -prootpassword < migrate_to_utf8.sql

# 3. Verificar migración
docker exec sinapsis_mysql mysql -u root -prootpassword -e "SELECT TABLE_NAME, TABLE_COLLATION FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'sinapsis_db';"
```

### 🔍 Verificar configuración UTF-8

```bash
# Ver charset del servidor
docker exec sinapsis_mysql mysql -u root -prootpassword -e "SHOW VARIABLES LIKE 'character_set%';"

# Ver charset de la base de datos
docker exec sinapsis_mysql mysql -u root -prootpassword -e "SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'sinapsis_db';"

# Ver charset de las tablas
docker exec sinapsis_mysql mysql -u root -prootpassword -e "SELECT TABLE_NAME, TABLE_COLLATION FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'sinapsis_db';"
``` 