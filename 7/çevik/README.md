# Cengavers Projesi

Bu proje, "Çevik Proje Geliştirme" dersi kapsamında geliştirilen, Üniversite kulüpl yönetimi odaklı bir web uygulamasıdır.

Proje, modern bir teknoloji yığını kullanarak REST API tabanlı bir arka yüz (Backend) ve bu API'yi kullanan dinamik bir ön yüz (Frontend) uygulamasından oluşmaktadır.

## Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend** | React, TypeScript, Vite | Dinamik kullanıcı arayüzleri için. |
| | Tailwind CSS | Modern ve hızlı CSS tasarımı için. |
| | React Router DOM | Sayfalar arası gezinme (routing) için. |
| | Axios & TanStack Query | Backend API ile asenkron iletişim için. |
| **Backend** | Java 17 & Spring Boot | Güçlü ve ölçeklenebilir REST API'ler için. |
| | Spring Data JPA (Hibernate) | Veritabanı işlemleri (ORM) için. |
| | Spring Security & JWT | Güvenlik ve kullanıcı yetkilendirme için. |
| **Veritabanı** | PostgreSQL | İlişkisel veri depolaması için. (Bulut-tabanlı) |

---

## Dokümantasyon

Projenin teknik mimari özeti, veri akış şemaları ve detaylı API endpoint tanımları `docs/` klasöründe bulunmaktadır:

* **[Mimari Özet ve Api Detayları](docs/mimari_ozet.md)**


---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin. Backend ve Frontend uygulamalarının **iki ayrı terminalde** çalıştırılması gerekmektedir.

### Gereksinimler
* Git
* Java 17 (veya üstü)
* Apache Maven
* Node.js (v18 veya üstü)
* PostgreSQL veritabanı (veya `application.yml` dosyasındaki Supabase bağlantısını kullanın)

#### Adım 1: Projeyi Kurulum
```bash
# Projenin ana deposunu klonlayın
git clone [https://github.com/cengaverytu/cengavers.git](https://github.com/cengaverytu/cengavers.git)
cd cengavers

Adım 2: Projeyi Klonlama (Kurulum)
cd cengavers/backend

mvn clean install

mvn spring-boot:run

cd cengavers/Frontend

npm install

npm run dev

Çalıştığı adres -> http://localhost:5173