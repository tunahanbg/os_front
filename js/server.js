const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'techbit-secret-key';

// PostgreSQL bağlantısı
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'techbit',
    password: process.env.POSTGRES_PASSWORD || 'techbit123',
    host: process.env.POSTGRES_HOST || 'postgres', // Docker container ismi
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || 'techbit_db'
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// JWT doğrulama middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Yetkilendirme başarısız' });
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Geçersiz token' });
        req.user = user;
        next();
    });
};

// Kimlik doğrulama endpoint'i
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Kullanıcıyı veritabanında ara
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' });
        }
        
        const user = result.rows[0];
        
        // Şifre kontrolü
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' });
        }
        
        // Son giriş zamanını güncelle
        await pool.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [user.id]
        );
        
        // JWT token oluştur
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        
        // Kullanıcı bilgilerini döndür (şifre hariç)
        delete user.password;
        
        res.json({
            ...user,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Kullanıcı listesi endpoint'i (sadece admin için)
app.get('/api/users', authenticateToken, async (req, res) => {
    try {
        // Sadece admin rolüne sahip kullanıcılar erişebilir
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
        }
        
        const result = await pool.query(
            'SELECT id, username, display_name, email, role, department, last_login FROM users ORDER BY id'
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Users fetch error:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// HTML sayfalarını servis et
app.get('*', (req, res) => {
    if (req.path === '/') {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        const filePath = path.join(__dirname, 'public', req.path.endsWith('.html') ? req.path : `${req.path}.html`);
        res.sendFile(filePath, (err) => {
            if (err) {
                res.sendFile(path.join(__dirname, 'public', 'index.html'));
            }
        });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});