Özellikler
Kullanıcılar için dinamik uçuş arama formu
Tek yönlü veya gidiş-dönüş uçuş seçenekleri
Uçuş sonuçlarının fiyat, kalkış ve varış zamanına göre sıralanması
Responsive tasarım
Kurulum
Projeyi lokal ortamınızda çalıştırmak için aşağıdaki adımları takip edin:

Projeyi klonlayın:

bash
Copy code
git clone https://github.com/your-repository/flight-search-app.git
Proje dizinine gidin:

bash
Copy code
cd flight-search-app
Gerekli npm paketlerini yükleyin:

bash
Copy code
npm install
JSON Server'ı başlatın (Veritabanı olarak kullanılacak):

bash
Copy code
npx json-server --watch db.json --port 3001
db.json, projenin kök dizinindeki JSON dosyasıdır ve uygulama tarafından kullanılan verileri içerir.

Uygulamayı geliştirme modunda başlatın:

bash
Copy code
npm start
Uygulama otomatik olarak varsayılan tarayıcınızda http://localhost:3000 adresinde açılacaktır.

Kullanım
Uygulama arayüzünde, kullanıcılar arama formunu kullanarak kalkış havaalanı, varış havaalanı, kalkış tarihi ve dönüş tarihi (isteğe bağlı) bilgilerini girer. Tek yönlü uçuş seçeneği de mevcuttur. Arama sonuçları, belirtilen kriterlere göre listelenecek ve kullanıcılar için çeşitli sıralama seçenekleri sunulacaktır.

Teknolojiler
ReactJS: Kullanıcı arayüzü bileşenleri
Formik ve Yup: Form yönetimi ve doğrulama
React Select: Özelleştirilmiş seçim kutuları
React Datepicker: Tarih seçimi
Axios: HTTP istekleri
JSON Server: Sahte REST API

Lisans
Bu proje MIT lisansı altında lisanslanmıştır.
