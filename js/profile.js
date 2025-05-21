// Profil sayfasını doldur
function fillProfilePage(user) {
    // Profil başlık bilgilerini doldur
    document.getElementById('profile-name').textContent = user.displayName;
    document.getElementById('profile-role').textContent = getRoleName(user.role);
    
    // Profil detay bilgilerini doldur
    document.getElementById('profile-username').textContent = user.username;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-department').textContent = user.department;
    document.getElementById('profile-last-login').textContent = user.lastLogin;
    
    // Erişim yetkilerini doldur
    fillAccessPermissions(user.role);
}

// Kullanıcının erişim yetkilerini doldur
function fillAccessPermissions(role) {
    const permissionsContainer = document.getElementById('access-permissions');
    if (!permissionsContainer) return;
    
    // Tüm servislerin erişim tanımları
    const services = [
        { name: 'GitLab', admin: 'full', devops: 'full', developer: 'limited', documentation: 'none' },
        { name: 'DokuWiki', admin: 'full', devops: 'read', developer: 'limited', documentation: 'full' },
        { name: 'Nagios', admin: 'full', devops: 'read', developer: 'none', documentation: 'none' },
        { name: 'Munin', admin: 'full', devops: 'read', developer: 'none', documentation: 'none' },
        { name: 'LDAP', admin: 'full', devops: 'none', developer: 'none', documentation: 'none' },
        { name: 'Email', admin: 'full', devops: 'none', developer: 'none', documentation: 'none' },
        { name: 'PostgreSQL', admin: 'full', devops: 'full', developer: 'limited', documentation: 'none' },
        { name: 'Etherpad', admin: 'full', devops: 'none', developer: 'full', documentation: 'full' },
        { name: 'Docker', admin: 'full', devops: 'full', developer: 'none', documentation: 'none' },
        { name: 'Elastic', admin: 'full', devops: 'full', developer: 'none', documentation: 'full' },
        { name: 'Portainer', admin: 'full', devops: 'full', developer: 'full', documentation: 'none' },
        { name: 'Ansible', admin: 'full', devops: 'full', developer: 'none', documentation: 'none' }
    ];
    
    // Her servis için erişim türünü belirle ve HTML oluştur
    let permissionsHTML = '';
    
    services.forEach(service => {
        // Kullanıcının bu servise erişim türünü al
        const accessType = service[role] || 'none';
        
        // Erişim türüne göre Türkçe metin
        const accessText = {
            'full': 'Tam Erişim',
            'limited': 'Sınırlı Erişim',
            'read': 'Salt Okuma',
            'none': 'Erişim Yok'
        };
        
        permissionsHTML += `
            <div class="permission-item">
                <div class="permission-title">${service.name}</div>
                <div class="permission-type ${accessType}">${accessText[accessType]}</div>
            </div>
        `;
    });
    
    permissionsContainer.innerHTML = permissionsHTML;
}