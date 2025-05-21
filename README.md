# TechBit Yönetim Paneli

TechBit startup'ı için rol tabanlı bir yönetim paneli.

## Özellikler

* PostgreSQL ile kullanıcı kimlik doğrulama
* Rol tabanlı erişim kontrolü (admin, devops, developer, documentation)
* Kullanıcı yönetimi (admin)
* Servis erişimi ve yönetimi

## Kurulum

### Gereksinimler

* Docker ve Docker Compose
* Node.js (yerel geliştirme için)

### Docker ile Kurulum

1. Projeyi klonlayın:
   ```
   git clone https://github.com/your-username/techbit-admin.git
   cd techbit-admin
   ```
2. Docker Compose ile başlatın:
   ```
   docker-compose up -d
   ```
3. Tarayıcınızda** **`http://localhost:3000` adresine gidin.

### Nginx ile Kurulum

1. Nginx yapılandırma dosyasını** **`/etc/nginx/sites-available/` dizinine kopyalayın:
   ```
   sudo cp nginx.conf /etc/nginx/sites-available/techbit
   ```
2. Siteyi etkinleştirin:
   ```
   sudo ln -s /etc/nginx/sites-available/techbit /etc/nginx/sites-enabled/
   ```
3. Nginx yapılandırmasını test edin:
   ```
   sudo nginx -t
   ```
4. Nginx'i yeniden başlatın:
   ```
   sudo systemctl restart nginx
   ```
5. Tarayıcınızda** **`http://techbit.local` adresine gidin (veya yapılandırmada belirttiğiniz domain adına).

## Kullanım

### Varsayılan Kullanıcılar

Aşağıdaki kullanıcılar sistemde varsayılan olarak tanımlıdır:

* **Admin** : yaltay / password123
* **DevOps** : tbuyukgebiz / password123
* **Developer** : ngok / password123
* **Documentation** : egenc / password123

### Servisler

Kullanıcı rolüne göre aşağıdaki servislere erişim sağlanabilir:

* GitLab (Kod Yönetimi & CI/CD)
* DokuWiki (Dokümantasyon)
* PostgreSQL (Veritabanı)
* Nagios ve Munin (İzleme)
* Email (Postfix & Dovecot)
* Etherpad (İşbirlikçi Metin Editörü)
* Elastic (Arama)
* Portainer (Container Yönetimi)

## Geliştirme

1. Bağımlılıkları yükleyin:
   ```
   npm install
   ```
2. Geliştirme modunda başlatın:
   ```
   npm run dev
   ```

## PostgreSQL Veritabanı

PostgreSQL veritabanına erişmek için:

```
psql -h localhost -U techbit -d techbit_db
```

Varsayılan şifre:** **`techbit123`

## Lisans

MIT
