# Flight Application

# Özellikler

- Kullanıcılar için dinamik uçuş arama formu
- Tek yönlü veya gidiş-dönüş uçuş seçenekleri
- Uçuş sonuçlarının fiyat, kalkış ve varış zamanına göre sıralanması
- Responsive tasarım
- Kurulum

Projeyi lokal ortamınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

NVM ile Node.js'in son güncel versiyonunu kullandığınızdan emin olun:

```bash
nvm install 20.11.0
```

```bash
nvm use 20.11.0
```

Projeyi klonlamak için:

```bash
git clone https://github.com/umutbrkee/flight-search-app.git
```

Proje dizinine gidin:

```bash
cd flight-search-app
```

Gerekli npm paketlerini yükleyin:

```bash
npm install
```

JSON Server'ı yeni bir terminal sekmesinde başlatın (Veritabanı olarak kullanılacak):

```bash
npx json-server --watch mockData/flights.json --port 3001
```

flights.json, projenin mockData dizinindeki JSON dosyasıdır ve uygulama tarafından kullanılan verileri içerir.

Uygulamayı geliştirme modunda başlatın:

```bash
npm start
```

Uygulama otomatik olarak varsayılan tarayıcınızda http://localhost:3000 adresinde açılacaktır.

# Kullanım

Uygulama arayüzünde, kullanıcılar arama formunu kullanarak kalkış havaalanı, varış havaalanı, kalkış tarihi ve dönüş tarihi (isteğe bağlı) bilgilerini girer. Tek yönlü uçuş seçeneği de mevcuttur.

Arama sonuçları, belirtilen kriterlere göre listelenecek ve kullanıcılar için çeşitli sıralama seçenekleri sunulacaktır.

# Test Talimatları

Uygulamayı düzgün bir şekilde test edebilmek için lütfen Json dosyasındaki uçuşları tarihine dikkat ederek arayın.

_Paris-Frankfurt arasında 24.02.2024 ve 04.03.2024 tarihleri seçilebilir_

# Teknolojiler

ReactJS: Kullanıcı arayüzü bileşenleri

Formik ve Yup: Form yönetimi ve doğrulama

React Select: Özelleştirilmiş seçim kutuları

React Datepicker: Tarih seçimi

Axios: HTTP istekleri

JSON Server: Sahte REST API
