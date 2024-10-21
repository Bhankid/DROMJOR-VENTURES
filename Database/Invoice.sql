CREATE TABLE Invoice (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Paid', 'Pending') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
