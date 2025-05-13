document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const messageEl = document.getElementById('login-message');
    
    // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
    if (sessionStorage.getItem('user')) {
        window.location.href = '/index.html';
        return;
    }
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        messageEl.textContent = 'Giriş yapılıyor...';
        messageEl.style.color = '#3498db';
        
        try {
            // Basic Auth ile kimlik doğrulama için base64 kodlaması
            const credentials = btoa(`${username}:${password}`);
            
            const response = await fetch('/auth-check', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });
            
            if (response.ok) {
                // Kullanıcı kimlik bilgilerini al
                const data = await response.json();
                const gidNumber = response.headers.get('X-User-GID');
                
                // Kullanıcı rolünü belirle
                let userRole = 'user';
                let roleName = 'Kullanıcı';
                
                // GID numarasına göre rol ataması
                if (gidNumber === '500') {
                    userRole = 'admin';
                    roleName = 'Yönetici';
                } else if (gidNumber === '501') {
                    userRole = 'devops';
                    roleName = 'DevOps';
                } else if (gidNumber === '502') {
                    userRole = 'developer';
                    roleName = 'Geliştirici';
                } else if (gidNumber === '503') {
                    userRole = 'documentation';
                    roleName = 'Dokümantasyon';
                }
                
                // Kullanıcı bilgilerini oluştur
                const userData = {
                    username: username,
                    displayName: username.charAt(0).toUpperCase() + username.slice(1),
                    role: userRole,
                    roleName: roleName,
                    email: `${username}@techbit.com`,
                    department: 'IT Departmanı',
                    lastLogin: new Date().toLocaleString()
                };
                
                // Kullanıcı bilgilerini sakla
                sessionStorage.setItem('user', JSON.stringify(userData));
                sessionStorage.setItem('authHeader', `Basic ${credentials}`);
                
                // Başarılı giriş mesajı
                messageEl.textContent = 'Giriş başarılı! Yönlendiriliyorsunuz...';
                messageEl.style.color = '#2ecc71';
                
                // Ana sayfaya yönlendir
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1000);
            } else {
                // Başarısız giriş durumunda
                messageEl.textContent = 'Kullanıcı adı veya şifre hatalı';
                messageEl.style.color = '#e74c3c';
            }
        } catch (error) {
            console.error('Giriş hatası:', error);
            messageEl.textContent = 'Bir hata oluştu. Lütfen tekrar deneyin.';
            messageEl.style.color = '#e74c3c';
        }
    });
});