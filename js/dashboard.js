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

    // Click outside handler for mobile
    document.addEventListener("click", function (e) {
        if (window.innerWidth <= 992) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggle = toggleBtn.contains(e.target);

            if (
                !isClickInsideSidebar &&
                !isClickOnToggle &&
                sidebar.classList.contains("active")
            ) {
                sidebar.classList.remove("active");
                mainContent.classList.remove("full-width");
            }
        }
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

    function showAllCards() {
        serviceCards.forEach((card) => {
            card.style.display = "flex";
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

// Test kullanıcıları
const testUsers = [
    {
        username: "admin.user",
        displayName: "Admin User",
        role: "admin",
        email: "admin.user@techbit.com",
        department: "IT Yönetimi",
        lastLogin: "2025-05-06 10:15",
        isActive: true,
    },
    {
        username: "devops.user",
        displayName: "DevOps User",
        role: "devops",
        email: "devops.user@techbit.com",
        department: "DevOps Ekibi",
        lastLogin: "2025-05-06 09:30",
        isActive: true,
    },
    {
        username: "developer.user",
        displayName: "Developer User",
        role: "developer",
        email: "developer.user@techbit.com",
        department: "Yazılım Geliştirme",
        lastLogin: "2025-05-06 11:45",
        isActive: true,
    },
    {
        username: "doc.user",
        displayName: "Documentation User",
        role: "documentation",
        email: "doc.user@techbit.com",
        department: "Teknik Dokümantasyon",
        lastLogin: "2025-05-06 08:20",
        isActive: true,
    },
];

// Kullanıcı oturumu kontrolü
function checkUserSession() {
    // Gerçek uygulamada oturum bilgisi sessionStorage'dan alınacak
    // Burada test amaçlı sabit bir kullanıcı tanımlıyoruz
    // Bu kısım LDAP entegrasyonu ile değiştirilecek

    // Test için admin kullanıcısını varsayılan olarak kullan
    const user = testUsers[0]; // Documentation user

    if (user) {
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
    } else {
        // Kullanıcı girişi yok, login sayfasına yönlendir
        console.log(
            "Kullanıcı oturumu bulunamadı, giriş sayfasına yönlendirilecek."
        );
    }
}

// Kullanıcı bilgileriyle UI'ı güncelle
function updateUIWithUserInfo(user) {
    const userNameEl = document.querySelector(".user-name");
    const userRoleEl = document.querySelector(".user-role");

    if (userNameEl) userNameEl.textContent = user.displayName;
    if (userRoleEl) userRoleEl.textContent = getRoleName(user.role);
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
        // Backend API'ye istek gönder
        // Gerçek uygulamada:
        /*
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        */

        // Test amaçlı sabit bir yanıt:
        const data = {
            success: true,
            user: {
                username: username,
                displayName: "Test Kullanıcı",
                role: "admin",
                email: `${username}@techbit.com`,
                department: "IT Departmanı",
                lastLogin: new Date().toLocaleString(),
            },
        };

        if (data.success) {
            // Başarılı oturum açma
            sessionStorage.setItem("user", JSON.stringify(data.user));
            return true;
        } else {
            // Hata durumunda
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

    let userListHTML = `
        <div class="user-management-header">
            <h2>Kullanıcı Yönetimi</h2>
            <button class="btn btn-primary" id="add-user-btn">
                <i class="fas fa-plus"></i> Yeni Kullanıcı
            </button>
        </div>
        <div class="user-table-container">
            <table class="user-table">
                <thead>
                    <tr>
                        <th>Kullanıcı Adı</th>
                        <th>Ad Soyad</th>
                        <th>E-posta</th>
                        <th>Departman</th>
                        <th>Rol</th>
                        <th>Son Giriş</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
    `;

    testUsers.forEach((user) => {
        userListHTML += `
            <tr>
                <td>${user.username}</td>
                <td>${user.displayName}</td>
                <td>${user.email}</td>
                <td>${user.department}</td>
                <td><span class="role-badge ${user.role}">${getRoleName(
            user.role
        )}</span></td>
                <td>${user.lastLogin}</td>
                <td>
                    <span class="status-badge ${
                        user.isActive ? "active" : "inactive"
                    }">
                        ${user.isActive ? "Aktif" : "Pasif"}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit-user" data-username="${
                            user.username
                        }" title="Düzenle">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-user" data-username="${
                            user.username
                        }" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    userListHTML += `
                </tbody>
            </table>
        </div>
    `;

    userListContainer.innerHTML = userListHTML;

    // Event listeners for user management actions
    document.querySelectorAll(".edit-user").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const username = e.currentTarget.dataset.username;
            console.log("Edit user:", username);
            // Edit user functionality will be implemented later
        });
    });

    document.querySelectorAll(".delete-user").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const username = e.currentTarget.dataset.username;
            console.log("Delete user:", username);
            // Delete user functionality will be implemented later
        });
    });

    document.getElementById("add-user-btn")?.addEventListener("click", () => {
        console.log("Add new user");
        // Add user functionality will be implemented later
    });
}
