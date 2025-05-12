document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const messageEl = document.getElementById('login-message');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        messageEl.textContent = 'Giriş yapılıyor...';
        messageEl.style.color = '#3498db';
        
        try {
            // LDAP/FreeIPA ile kimlik doğrulama işlemi
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Başarılı giriş durumunda
                messageEl.textContent = 'Giriş başarılı! Yönlendiriliyorsunuz...';
                messageEl.style.color = '#2ecc71';
                
                // Kullanıcı bilgilerini sakla
                sessionStorage.setItem('user', JSON.stringify(data.user));
                
                // Ana sayfaya yönlendir
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1000);
            } else {
                // Başarısız giriş durumunda
                messageEl.textContent = data.message || 'Kullanıcı adı veya şifre hatalı';
                messageEl.style.color = '#e74c3c';
            }
        } catch (error) {
            console.error('Giriş hatası:', error);
            messageEl.textContent = 'Bir hata oluştu. Lütfen tekrar deneyin.';
            messageEl.style.color = '#e74c3c';
        }
    });
});