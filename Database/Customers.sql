CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    telephone_number VARCHAR(15) NOT NULL UNIQUE,
    total_orders INT DEFAULT 0,
    amount_paid DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
