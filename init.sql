-- Veritabanını oluştur (eğer Docker container dışında çalıştırıyorsanız)
-- CREATE DATABASE techbit_db;

-- Kullanıcı tablosu
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    department VARCHAR(100),
    last_login TIMESTAMP
);

-- Varsayılan kullanıcılar için şifreler: password123
INSERT INTO users (username, password, display_name, email, role, department) VALUES
    ('yaltay', '$2b$10$pI7SYC1Y7XiNNgAcAR.Kk.tCH5Pm2k3mRLXyLCB5X.mKANsEZniqe', 'Yavuz Altay', 'yaltay@techbit.com', 'admin', 'IT Departmanı'),
    ('tbuyukgebiz', '$2b$10$pI7SYC1Y7XiNNgAcAR.Kk.tCH5Pm2k3mRLXyLCB5X.mKANsEZniqe', 'Tunahan Buyukgebiz', 'tbuyukgebiz@techbit.com', 'devops', 'IT Departmanı'),
    ('ngok', '$2b$10$pI7SYC1Y7XiNNgAcAR.Kk.tCH5Pm2k3mRLXyLCB5X.mKANsEZniqe', 'Necat Gok', 'ngok@techbit.com', 'developer', 'IT Departmanı'),
    ('egenc', '$2b$10$pI7SYC1Y7XiNNgAcAR.Kk.tCH5Pm2k3mRLXyLCB5X.mKANsEZniqe', 'Emre Genc', 'egenc@techbit.com', 'documentation', 'IT Departmanı');

-- Şifre yardımcısı (bcrypt'te $2b$10$pI7SYC1Y7XiNNgAcAR.Kk.tCH5Pm2k3mRLXyLCB5X.mKANsEZniqe = 'password123' şifresinin hash'i)
-- Yeni bir kullanıcı için şifre oluşturmak isterseniz, Node.js'de aşağıdaki kodu kullanabilirsiniz:
-- const bcrypt = require('bcrypt');
-- const hashedPassword = bcrypt.hashSync('password123', 10);
-- console.log(hashedPassword);