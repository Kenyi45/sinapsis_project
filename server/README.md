# 🚀 Sinapsis SMS Backend - Refactored Architecture

## 📋 Overview

This is the **refactored version** of the Sinapsis SMS Campaign Management System backend, implementing **SOLID principles** and **design patterns**. The new architecture provides better maintainability, testability, and scalability.

## 🏗️ Architecture Overview

### Design Patterns Implemented

- **🏭 Factory Pattern**: Centralized dependency management
- **📊 Repository Pattern**: Data access abstraction
- **🔄 Singleton Pattern**: Single database connection
- **💉 Dependency Injection**: Constructor-based injection
- **🎯 Command Pattern**: Campaign processing

### SOLID Principles Applied

- **S** - Single Responsibility
- **O** - Open/Closed
- **L** - Liskov Substitution
- **I** - Interface Segregation
- **D** - Dependency Inversion

## 📁 Project Structure

```
server/
├── src/
│   ├── core/                          # Core architecture components
│   │   ├── interfaces/                # Contract definitions
│   │   │   ├── IRepository.js         # Repository interface
│   │   │   └── IService.js            # Service interface
│   │   ├── database/                  # Database layer
│   │   │   └── DatabaseConnection.js  # Singleton connection
│   │   ├── repositories/              # Base repository
│   │   │   └── BaseRepository.js      # Common CRUD operations
│   │   └── factories/                 # Dependency injection
│   │       └── ServiceFactory.js      # DI container
│   ├── repositories/                  # Data access layer
│   │   ├── CampaignRepository.js      # Campaign data operations
│   │   ├── MessageRepository.js       # Message data operations
│   │   └── UserRepository.js          # User data operations
│   ├── services/                      # Business logic layer
│   │   ├── CampaignService.js         # Campaign business logic
│   │   ├── MessageService.js          # Message business logic
│   │   └── UserService.js             # User business logic
│   ├── controllers/                   # HTTP handling layer
│   │   ├── CampaignController.js      # Campaign HTTP endpoints
│   │   ├── MessageController.js       # Message HTTP endpoints
│   │   └── UserController.js          # User HTTP endpoints
│   ├── handlers/                      # Serverless handlers
│   │   ├── campaigns-refactored.js    # New refactored handlers
│   │   └── campaigns.js               # Legacy handlers
│   └── utils/                         # Utility classes
│       ├── DateUtils.js               # Date formatting utilities
│       └── PhoneListProcessor.js      # Phone list processing
├── serverless.yml                     # Original configuration
├── serverless-refactored.yml          # New architecture config
└── test-refactored-architecture.js    # Architecture test script
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Docker (optional)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database setup**:
   ```bash
   # Using Docker
   docker-compose up -d

   # Or run the migration scripts
   npm run migrate:utf8
   ```

### Running the Application

#### Option 1: Use Refactored Architecture (Recommended)

```bash
# Start with new architecture
npx serverless offline --config serverless-refactored.yml

# The API will be available at:
# - New endpoints: http://localhost:3000/api/v2/*
# - Legacy endpoints: http://localhost:3000/api/* (for backward compatibility)
```

#### Option 2: Use Legacy Architecture

```bash
# Start with original architecture
npx serverless offline

# API available at: http://localhost:3000/api/*
```

### Testing the Architecture

Run the comprehensive architecture test:

```bash
node test-refactored-architecture.js
```

This will test:
- ✅ Database connectivity
- ✅ Repository layer functionality
- ✅ Service layer business logic
- ✅ Controller layer HTTP handling
- ✅ Factory pattern dependency injection
- ✅ UTF-8 character support
- ✅ SOLID principles compliance

## 🔗 API Endpoints

### New Refactored Endpoints (v2)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v2/campaigns` | List campaigns with filters |
| `POST` | `/api/v2/campaigns` | Create new campaign |
| `GET` | `/api/v2/campaigns/{id}` | Get campaign by ID |
| `PUT` | `/api/v2/campaigns/{id}` | Update campaign |
| `DELETE` | `/api/v2/campaigns/{id}` | Delete campaign |
| `POST` | `/api/v2/campaigns/{id}/process` | Process campaign |
| `GET` | `/api/v2/health` | Health check |

### Legacy Endpoints (v1)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/campaigns` | List campaigns (legacy) |
| `POST` | `/api/campaigns` | Create campaign (legacy) |
| `GET` | `/api/campaigns/{id}` | Get campaign (legacy) |
| `POST` | `/api/campaigns/{id}/process` | Process campaign (legacy) |
| `GET` | `/api/campaigns/{campaignId}/messages` | Get campaign messages |
| `GET` | `/api/messages/{id}` | Get message by ID |
| `GET` | `/api/users` | List users |
| `GET` | `/api/health` | Health check (legacy) |

## 🏗️ Architecture Components

### 1. Repository Layer

**Purpose**: Data access abstraction

```javascript
// Example usage
const campaignRepo = serviceFactory.getRepository('campaign');
const campaigns = await campaignRepo.findAll(filters, pagination);
```

**Features**:
- Base CRUD operations
- UTF-8 safe queries
- Prepared statements
- Error handling

### 2. Service Layer

**Purpose**: Business logic implementation

```javascript
// Example usage
const campaignService = serviceFactory.getService('campaign');
const result = await campaignService.create(campaignData);
```

**Features**:
- Input validation
- Business rule enforcement
- Cross-entity operations
- Standardized responses

### 3. Controller Layer

**Purpose**: HTTP request/response handling

```javascript
// Example usage
const campaignController = serviceFactory.getController('campaign');
const response = await campaignController.list(event);
```

**Features**:
- Request parsing
- Response formatting
- CORS handling
- Error responses

### 4. Factory Pattern

**Purpose**: Dependency injection container

```javascript
// Get any component
const service = serviceFactory.getService('campaign');
const controller = serviceFactory.getController('message');
const repository = serviceFactory.getRepository('user');
```

## 🌐 UTF-8 Support

The refactored architecture includes comprehensive UTF-8 support:

- **Database**: `utf8mb4` charset with `utf8mb4_unicode_ci` collation
- **Connection**: UTF-8 encoding for all database connections
- **Queries**: Safe handling of special characters and emojis
- **API**: Proper Content-Type headers for UTF-8 responses

## 🧪 Testing

### Unit Testing

```bash
# Test individual components
npm test

# Test with coverage
npm run test:coverage
```

### Integration Testing

```bash
# Test the complete architecture
node test-refactored-architecture.js
```

### Manual Testing

```bash
# Test campaign creation with UTF-8
curl -X POST http://localhost:3000/api/v2/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "name": "Campaña con Ñ y Acentos: áéíóú",
    "message_text": "¡Hola! Mensaje con emojis 🎉📱",
    "process_date": "2024-12-05",
    "process_hour": "10:00:00",
    "phone_list": ["123456789"]
  }'
```

## 🔧 Configuration

### Environment Variables

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sinapsis_db
DB_USER=sinapsis_user
DB_PASSWORD=sinapsis_password

# Application Configuration
NODE_ENV=development
```

### Serverless Configuration

The refactored architecture uses `serverless-refactored.yml` which includes:

- ✅ Both v1 (legacy) and v2 (refactored) endpoints
- ✅ Backward compatibility
- ✅ Enhanced CORS configuration
- ✅ Environment-specific settings
- ✅ Detailed function descriptions

## 📈 Benefits of Refactored Architecture

### Maintainability
- **Clear separation of concerns**
- **Single responsibility per class**
- **Easy to understand and modify**

### Testability
- **Dependency injection enables mocking**
- **Isolated components for unit testing**
- **Comprehensive test coverage**

### Scalability
- **Easy to add new features**
- **Extensible without breaking existing code**
- **Modular architecture**

### Performance
- **Singleton database connection**
- **Optimized queries**
- **Efficient error handling**

## 🔄 Migration Guide

### From Legacy to Refactored

1. **Update your frontend** to use v2 endpoints:
   ```typescript
   // Old
   this.http.get('/api/campaigns')
   
   // New
   this.http.get('/api/v2/campaigns')
   ```

2. **Test both versions** during transition period

3. **Gradually migrate** endpoints one by one

4. **Remove legacy endpoints** when migration is complete

## 🤝 Contributing

1. Follow SOLID principles
2. Add tests for new features
3. Update documentation
4. Use the factory pattern for new components

## 📝 License

MIT License - see LICENSE file for details

---

## 🎯 Quick Start Commands

```bash
# Install and setup
npm install
cp .env.example .env

# Start refactored architecture
npx serverless offline --config serverless-refactored.yml

# Test architecture
node test-refactored-architecture.js

# Create a campaign with UTF-8
curl -X POST http://localhost:3000/api/v2/campaigns \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"name":"Campaña de Prueba","message_text":"¡Hola! 🎉","process_date":"2024-12-05","process_hour":"10:00:00","phone_list":["123456789"]}'
```

**🚀 Your refactored SMS campaign management system is ready!** 