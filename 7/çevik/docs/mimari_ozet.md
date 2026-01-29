# Proje Mimari Özeti

## 1. Giriş ve Hedef

Bu doküman, "Cengavers" projesinin temel mimari yapısını, kullanılan ana teknolojileri ve bileşenler arası veri akışını özetler.

Proje, Üniversite kuküplerinin kolay ve erişilebilir bir yönetim sağlaması için amacıyla geliştirilmiş, modern bir web uygulamasıdır. Sistem, bağımsız bir Ön Yüz (Frontend) uygulaması ve bir Arka Yüz (Backend) REST API servisinden oluşmaktadır.

## 2. Teknoloji Yığını (Tech Stack)

### 2.1. Ön Yüz (Frontend)
* **Dil:** TypeScript
* **Ana Kütüphane:** React (v19)
* **Derleyici/Build Aracı:** Vite
* **Yönlendirme (Routing):** React Router DOM
* **Stil (UI/CSS):** Tailwind CSS
* **API İletişimi:** Axios
* **Durum Yönetimi (API):** TanStack Query (React Query)
* **Form Yönetimi:** React Hook Form & Zod (Validasyon için)

### 2.2. Arka Yüz (Backend)
* **Dil ve Çerçeve:** Java (Spring Boot)
* **Java Sürümü:** 17
* **API Tipi:** REST API (Spring Web aracılığıyla)
* **Güvenlik:** Spring Security ve JWT (JSON Web Token)

### 2.3. Veri Katmanı (Database / DB)
* **Veritabanı Sistemi:** PostgreSQL
* **Veri Erişim Katmanı (ORM):** Spring Data JPA (Hibernate)

## 3. Sistem Bileşenleri ve Yapı

Sistem 3 ana katmandan oluşmaktadır:

1.  **Kullanıcı Arayüzü (UI):** React ve TypeScript kullanılarak geliştirilmiş, tarayıcıda çalışan (client-side) tek sayfa uygulamasıdır. Kullanıcı etkileşimini yönetir ve verileri `Axios` kullanarak Backend API'den talep eder.
2.  **API Servisi (Backend):** Spring Boot (Java 17) kullanılarak geliştirilmiş, sunucu tarafı REST API servisidir. UI'dan gelen JSON isteklerini işler, Spring Data JPA aracılığıyla veritabanı ile konuşur ve JSON formatında yanıtlar döner.
3.  **Veritabanı (DB):** PostgreSQL veritabanıdır. Tüm kalıcı verileri (kullanıcılar, duyurular vb.) saklar.


# 📡 API Uç Noktası (Endpoint) Detayları

Bu doküman, Cengavers backend servisi tarafından sunulan ve `controller` dosyalarında tanımlanan gerçek API uç noktalarını listeler.

**API Ana URL (Lokal):** `http://localhost:8080`

---

## 1. Yetkilendirme API (`/api/auth`)

Kullanıcı kaydı (sign-up), giriş (sign-in) ve çıkış (sign-out) işlemlerini yönetir.

* `POST /api/auth/sign-up`: Yeni bir kullanıcı hesabı oluşturur.
* `POST /api/auth/sign-in`: Mevcut bir kullanıcıyı sisteme dahil eder ve bir oturum cookie'si oluşturur.
* `POST /api/auth/sign-out`: Kullanıcı oturumunu sonlandırır.

---

## 2. Kullanıcı API (`/api/users`)

Kullanıcı hesaplarını yönetir.

* `POST /api/users`: Yeni bir kullanıcı oluşturur.
* `GET /api/users`: Tüm kullanıcıları listeler.
* `GET /api/users/me`: O an giriş yapmış olan kullanıcının bilgilerini getirir.
* `GET /api/users/{id}`: Belirli bir kullanıcıyı ID ile getirir.
* `PUT /api/users/{id}`: Belirli bir kullanıcıyı günceller.
* `DELETE /api/users/{id}`: Belirli bir kullanıcıyı siler.
* `POST /api/users/save-admin`: Yeni bir admin kullanıcısı kaydeder.

---

## 3. Rol API (`/api/roles`)

Sistemdeki kullanıcı rollerini (örn: user, admin) yönetir.

* `POST /api/roles`: Yeni bir rol oluşturur.
* `GET /api/roles`: Tüm rolleri listeler.
* `GET /api/roles/{id}`: Belirli bir rolü ID ile getirir.
* `PUT /api/roles/{id}`: Belirli bir rolü günceller.
* `DELETE /api/roles/{id}`: Belirli bir rolü siler.

---

## 4. Mesajlaşma API (`/api/messages`)

Sistemdeki mesajlar üzerinde CRUD (Oluşturma, Okuma, Güncelleme, Silme) işlemlerini yönetir.

* `POST /api/messages`: Yeni bir mesaj oluşturur.
* `GET /api/messages`: Sistemdeki tüm mesajları listeler.
* `GET /api/messages/{id}`: Belirli bir ID'ye sahip mesajı getirir.
* `PUT /api/messages/{id}`: Belirli bir ID'ye sahip mesajı günceller.
* `DELETE /api/messages/{id}`: Belirli bir ID'ye sahip mesajı siler.

##  Mesajlaşma API (`/api/messages`) örnek JSON


GET /api/messages  {
"id": 0,
"content": "string",
"status": true
}


## Veri Akış Diyagramı (UI → API → DB)

Aşağıdaki şema, bir kullanıcının arayüzden (React) bir istek göndermesiyle başlayan ve verinin veritabanından (PostgreSQL) geri dönmesiyle sonlanan tam veri akışını gösterir.


```mermaid
    A[Kullanıcı Arayüzü - React] -->|1. (GET /api/messages) API İsteği| B(API Servisi - Spring Boot);
    B -->|2. Veritabanı Sorgusu (SELECT *)| C{Veritabanı - PostgreSQL};
    C -->|3. Sorgu Sonucu (Mesaj Listesi)| B;
    B -->|4. JSON Yanıtı (200 OK)| A;
    A -->|5. Veriyi Ekranda Göster| A;


