CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer VARCHAR(255) NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Delivered', 'Processing', 'Pending') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


