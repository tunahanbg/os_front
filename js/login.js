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
        
        // PostgreSQL ile giriş yap
        const result = await window.dbModule.loginWithPostgres(username, password);
        
        if (result.success) {
            // Başarılı giriş mesajı
            messageEl.textContent = 'Giriş başarılı! Yönlendiriliyorsunuz...';
            messageEl.style.color = '#2ecc71';
            
            // Ana sayfaya yönlendir
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1000);
        } else {
            // Başarısız giriş durumunda
            messageEl.textContent = result.message || 'Kullanıcı adı veya şifre hatalı';
            messageEl.style.color = '#e74c3c';
        }
    });
});