-- Crear base de datos con charset UTF-8
CREATE DATABASE IF NOT EXISTS sinapsis_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE sinapsis_db;

-- Tabla customers
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla campaigns
CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    process_date DATE NOT NULL,
    process_hour TIME NOT NULL,
    process_status INT DEFAULT 0,
    phone_list VARCHAR(255),
    message_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla messages
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    text TEXT,
    shipping_status INT DEFAULT 0,
    process_date DATE NOT NULL,
    process_hour TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo
INSERT INTO customers (name, status) VALUES 
('Empresa ABC', TRUE),
('Corporación XYZ', TRUE),
('Startup Tech', FALSE);

INSERT INTO users (customer_id, username, status) VALUES 
(1, 'admin_abc', TRUE),
(1, 'user_abc', TRUE),
(2, 'admin_xyz', TRUE),
(3, 'dev_tech', FALSE);

INSERT INTO campaigns (user_id, name, process_date, process_hour, process_status, phone_list, message_text) VALUES 
(1, 'Campaña Promocional', '2024-01-15', '10:00:00', 1, 'lista_telefonica_1.csv', 'Hola! Tenemos una oferta especial para ti.'),
(2, 'Campaña Informativa', '2024-01-16', '14:30:00', 0, 'lista_telefonica_2.csv', 'Información importante sobre nuestros servicios.'),
(3, 'Campaña de Seguimiento', '2024-01-17', '09:15:00', 2, 'lista_telefonica_3.csv', 'Gracias por tu interés en nuestros productos.');

INSERT INTO messages (campaign_id, phone, text, shipping_status, process_date, process_hour) VALUES 
(1, '+1234567890', 'Hola! Tenemos una oferta especial para ti.', 1, '2024-01-15', '10:05:00'),
(1, '+1234567891', 'Hola! Tenemos una oferta especial para ti.', 1, '2024-01-15', '10:06:00'),
(2, '+1234567892', 'Información importante sobre nuestros servicios.', 0, '2024-01-16', '14:35:00'),
(3, '+1234567893', 'Gracias por tu interés en nuestros productos.', 2, '2024-01-17', '09:20:00'); 