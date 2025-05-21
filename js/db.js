// PostgreSQL bağlantısı için API istekleri yönetimi
const API_BASE_URL = '/api';

// PostgreSQL ile kullanıcı doğrulama
async function loginWithPostgres(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Kullanıcı bilgilerini oluştur
            const userData = {
                username: data.username,
                displayName: data.display_name || data.username.charAt(0).toUpperCase() + data.username.slice(1),
                role: data.role,
                roleName: getRoleName(data.role),
                email: data.email || `${data.username}@techbit.com`,
                department: data.department || 'IT Departmanı',
                lastLogin: new Date().toLocaleString()
            };
            
            // Kullanıcı bilgilerini sakla
            sessionStorage.setItem('user', JSON.stringify(userData));
            sessionStorage.setItem('token', data.token);
            
            return { success: true, userData };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData.message || 'Giriş başarısız' };
        }
    } catch (error) {
        console.error("Oturum açma hatası:", error);
        return { success: false, message: 'Bir bağlantı hatası oluştu.' };
    }
}

// Kullanıcı listesini getir
async function getUsers() {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) return { success: false, message: 'Oturum bulunamadı' };
        
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const users = await response.json();
            return { success: true, users };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData.message || 'Kullanıcılar getirilemedi' };
        }
    } catch (error) {
        console.error("Kullanıcıları getirme hatası:", error);
        return { success: false, message: 'Bir bağlantı hatası oluştu.' };
    }
}

// Rol adını Türkçe olarak döndür
function getRoleName(roleCode) {
    const roleNames = {
        admin: "Yönetici",
        devops: "DevOps",
        developer: "Geliştirici",
        documentation: "Dokümantasyon",
    };
    return roleNames[roleCode] || roleCode;
}

// Modülü dışa aktar
window.dbModule = {
    loginWithPostgres,
    getUsers,
    getRoleName
};