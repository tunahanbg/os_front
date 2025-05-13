document.addEventListener("DOMContentLoaded", function () {
    // Sidebar toggle fonksiyonu
    const toggleBtn = document.querySelector(".toggle-sidebar");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");

    // Initial state based on screen size
    function setInitialState() {
        if (window.innerWidth <= 992) {
            sidebar.classList.add("collapsed");
            mainContent.classList.add("expanded");
        } else {
            sidebar.classList.remove("collapsed");
            mainContent.classList.remove("expanded");
        }
    }

    // Set initial state
    setInitialState();

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            sidebar.classList.toggle("collapsed");
            mainContent.classList.toggle("expanded");
        });
    }

    // Handle window resize
    window.addEventListener("resize", function () {
        setInitialState();
    });

    // Çıkış butonlarını dinle
    const logoutButtons = document.querySelectorAll(
        "#logout-button, #header-logout-button"
    );
    logoutButtons.forEach((btn) => {
        if (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                logout();
            });
        }
    });

    // Kullanıcı oturumu kontrolü
    checkUserSession();

    // Filter buttons functionality
    const filterButtons = document.querySelectorAll(".filter-btn");
    const serviceCards = document.querySelectorAll(".service-card");
    const dashboardLinks = document.querySelectorAll('a[href="index.html"]');

    // Add click handler to dashboard links to show all cards
    dashboardLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            // Only prevent default if we're already on the dashboard page
            if (window.location.pathname.endsWith("index.html")) {
                e.preventDefault();
                // Reset the view to show all accessible services
                const serviceCards = document.querySelectorAll(".service-card");
                serviceCards.forEach((card) => {
                    const accessRoles = card.getAttribute("data-access");
                    if (accessRoles) {
                        const roles = accessRoles.split(",");
                        if (roles.includes(window.currentUser.role)) {
                            card.style.display = "flex";
                        } else {
                            card.style.display = "none";
                        }
                    }
                });
            }
            updateActiveMenuItem(this);
        });
    });

    // Add click handlers to filter buttons
    filterButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            const filter = this.getAttribute("data-filter");

            // If we're not on the dashboard page, redirect to it with the filter
            if (!window.location.pathname.endsWith("index.html")) {
                // Store the filter in sessionStorage
                sessionStorage.setItem("activeFilter", filter);
                // Redirect to dashboard
                window.location.href = "index.html";
            } else {
                // We're already on the dashboard, just filter the cards
                filterCards(filter);
                updateActiveMenuItem(this);
            }
        });
    });

    // Check for stored filter on dashboard page load
    if (window.location.pathname.endsWith("index.html")) {
        const storedFilter = sessionStorage.getItem("activeFilter");
        if (storedFilter) {
            // Clear the stored filter
            sessionStorage.removeItem("activeFilter");
            // Apply the filter
            filterCards(storedFilter);
            // Update the active menu item
            const activeButton = document.querySelector(
                `.filter-btn[data-filter="${storedFilter}"]`
            );
            if (activeButton) {
                updateActiveMenuItem(activeButton);
            }
        }
    }

    function filterCards(category) {
        const serviceCards = document.querySelectorAll(".service-card");
        serviceCards.forEach((card) => {
            const cardCategory = card.getAttribute("data-category");
            const accessRoles = card.getAttribute("data-access");

            if (cardCategory === category) {
                // Special handling for documentation category and devops role
                if (
                    category === "documentation" &&
                    window.currentUser.role === "devops"
                ) {
                    // Only show DokuWiki for devops users
                    if (card.querySelector("h3").textContent === "DokuWiki") {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                } else {
                    // Normal filtering for other cases
                    if (accessRoles) {
                        const roles = accessRoles.split(",");
                        if (roles.includes(window.currentUser.role)) {
                            card.style.display = "flex";
                        } else {
                            card.style.display = "none";
                        }
                    } else {
                        card.style.display = "flex";
                    }
                }
            } else {
                card.style.display = "none";
            }
        });
    }

    function updateActiveMenuItem(clickedLink) {
        // Remove active class from all menu items
        document.querySelectorAll(".sidebar-menu li").forEach((item) => {
            item.classList.remove("active");
        });

        // Add active class to clicked item
        clickedLink.closest("li").classList.add("active");
    }
});

// Kullanıcı oturumu kontrolü
function checkUserSession() {
    // Session storage'dan kullanıcı bilgilerini al
    const userJSON = sessionStorage.getItem('user');
    
    if (!userJSON) {
        // Kullanıcı girişi yok, login sayfasına yönlendir
        if (!window.location.pathname.includes("login.html")) {
            window.location.href = "/login.html";
        }
        return;
    }
    
    // Kullanıcı bilgilerini parse et
    const user = JSON.parse(userJSON);
    
    // Store the current user globally
    window.currentUser = user;
    
    // Kullanıcı girişi var, UI'ı güncelle
    updateUIWithUserInfo(user);
    updateSidebarForRole(user.role);
    updateServiceCardsForRole(user.role);
    
    // Eğer profil sayfasındaysak, profil bilgilerini doldur
    if (window.location.pathname.includes("profile.html")) {
        fillProfilePage(user);
    }
    
    // Eğer kullanıcı yönetimi sayfasındaysak, kullanıcı listesini doldur
    if (window.location.pathname.includes("user-management.html")) {
        fillUserManagementPage(user);
    }
}

// Kullanıcı bilgileriyle UI'ı güncelle
function updateUIWithUserInfo(user) {
    const userNameEl = document.querySelector(".user-name");
    const userRoleEl = document.querySelector(".user-role");

    if (userNameEl) userNameEl.textContent = user.displayName;
    if (userRoleEl) userRoleEl.textContent = user.roleName || getRoleName(user.role);
}

// Sidebar'ı kullanıcı rolüne göre güncelle
function updateSidebarForRole(userRole) {
    const sidebarItems = document.querySelectorAll(".sidebar-menu li");

    sidebarItems.forEach((item) => {
        const accessRoles = item.getAttribute("data-access");

        if (accessRoles) {
            const roles = accessRoles.split(",");
            if (!roles.includes(userRole)) {
                item.style.display = "none";
            } else {
                item.style.display = "block";
            }
        }
    });
}

// Servis kartlarını kullanıcı rolüne göre güncelle
function updateServiceCardsForRole(userRole) {
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card) => {
        const accessRoles = card.getAttribute("data-access");

        if (accessRoles) {
            const roles = accessRoles.split(",");

            if (roles.includes(userRole)) {
                card.classList.remove("hidden-service");

                // Uygun erişim rozetini göster
                const badge = card.querySelector(`.access-badge.${userRole}`);
                if (badge) {
                    badge.style.display = "inline-block";
                }
            } else {
                card.classList.add("hidden-service");
            }
        }
    });
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

// LDAP ile oturum açma işlemi
async function loginWithLDAP(username, password) {
    try {
        // Basic Auth ile kimlik doğrulama
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
            
            return true;
        } else {
            console.error("Oturum açma başarısız");
            return false;
        }
    } catch (error) {
        console.error("Oturum açma hatası:", error);
        return false;
    }
}

// Oturumu kapat
function logout() {
    // Session bilgilerini temizle
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authHeader");

    // Login sayfasına yönlendir
    window.location.href = "/login.html";
}

// Kullanıcı yönetimi sayfasını doldur
function fillUserManagementPage(currentUser) {
    const userListContainer = document.querySelector(".user-list");
    if (!userListContainer) return;

    // Sadece admin rolüne sahip kullanıcılar kullanıcı yönetimi sayfasına erişebilir
    if (currentUser.role !== "admin") {
        userListContainer.innerHTML =
            '<div class="error-message">Bu sayfaya erişim yetkiniz bulunmamaktadır.</div>';
        return;
    }

    // LDAP kullanıcılarını almak için istek gönder
    fetch('/auth-check', {
        method: 'GET',
        headers: {
            'Authorization': sessionStorage.getItem('authHeader')
        }
    })
    .then(response => {
        if (response.ok) {
            // Kullanıcı listesini oluştur - gerçek uygulamada burası
            // LDAP'tan alınan kullanıcı listesi ile doldurulacak
            let userListHTML = `
                <div class="user-management-header">
                    <h2>Kullanıcı Yönetimi</h2>
                </div>
                <div class="user-table-container">
                    <table class="user-table">
                        <thead>
                            <tr>
                                <th>Kullanıcı Adı</th>
                                <th>Ad Soyad</th>
                                <th>E-posta</th>
                                <th>Rol</th>
                                <th>GID</th>
                                <th>Son Giriş</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            // Hardcoded kullanıcı listesi - LDAP ile entegre edilecek
            const ldapUsers = [
                { username: "yaltay", displayName: "Yavuz Altay", email: "yaltay@techbit.com", role: "admin", gid: "500", lastLogin: "2025-05-13 10:15" },
                { username: "tbuyukgebiz", displayName: "Tunahan Buyukgebiz", email: "tbuyukgebiz@techbit.com", role: "devops", gid: "501", lastLogin: "2025-05-13 09:30" },
                { username: "ngok", displayName: "Necat Gok", email: "ngok@techbit.com", role: "developer", gid: "502", lastLogin: "2025-05-13 11:45" },
                { username: "egenc", displayName: "Emre Genc", email: "egenc@techbit.com", role: "documentation", gid: "503", lastLogin: "2025-05-13 08:20" }
            ];

            ldapUsers.forEach((user) => {
                userListHTML += `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.displayName}</td>
                        <td>${user.email}</td>
                        <td><span class="role-badge ${user.role}">${getRoleName(user.role)}</span></td>
                        <td>${user.gid}</td>
                        <td>${user.lastLogin}</td>
                    </tr>
                `;
            });

            userListHTML += `
                        </tbody>
                    </table>
                </div>
            `;

            userListContainer.innerHTML = userListHTML;
        } else {
            userListContainer.innerHTML = '<div class="error-message">Kullanıcı listesi alınamadı. Yetki hatası.</div>';
        }
    })
    .catch(error => {
        console.error('Kullanıcı listesi alınamadı:', error);
        userListContainer.innerHTML = '<div class="error-message">Kullanıcı listesi alınamadı. Bir hata oluştu.</div>';
    });
}