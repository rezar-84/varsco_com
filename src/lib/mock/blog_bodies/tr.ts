/**
 * Turkish article bodies, keyed by post slug.
 *
 * Kept separate from blog_translations.ts (title/excerpt/category) because the
 * bodies are template literals: several posts embed images via ${...}
 * interpolation, which a plain JSON-style string map cannot express — the
 * placeholder would render literally.
 *
 * Every heading, list item, table row, inline product link and technical figure
 * from the English source is carried over. Terminology follows
 * doc/translation_agents.md §3 (canlı yem, Artemia kistleri, gözlenmiş yumurta,
 * kuluçkahane) in corporate siz-dili register.
 */
export const TR_BODIES: Record<string, string> = {
  "olive-flounder-farming-1": `Kore kalkan balığı (Olive Flounder) yetiştiriciliğinin heyecan verici dünyasını keşfedin! Optimum koşulların ve uzmanlaşmış tekniklerin, balık yetiştiriciliği faaliyetlerinizde nasıl başarılı sonuçlara dönüştüğünü incelemeye sizi davet ediyoruz. Hizmetlerimiz ve size nasıl destek olabileceğimiz hakkında daha fazla bilgi almak ister misiniz? Olanakları daha yakından keşfetmek için buraya tıklayın!`,

  "aegean-region-kılıcdeniz-hatchery-trials-2": `Müşteri: KılıçDeniz, Türkiye'nin en büyük su ürünleri yetiştiricilik şirketi

Bölge: Ege Kıyısı, Türkiye

Odak: Canlı Yem Optimizasyonu ve Özel Deneme Protokolleri

Zorluk:

KılıçDeniz, rotifer stabilitesi ve veriminde süregelen zorluklarla karşılaşıyordu; bu durum larva yetiştirme performansını sınırlıyor ve işletme maliyetlerini yükseltiyordu.

Yaptıklarımız:

KılıçDeniz'in kuluçkahane kurulumuna ve çevresel parametrelerine özel olarak uyarlanmış saha denemeleri gerçekleştirdikRotifer ve chlorella protokollerine odaklanarak birden fazla canlı yem formülasyonu tasarladık ve test ettikYerleşik izleme ve başarı ölçütleri içeren adım adım bir canlı yem yönetim planı uyguladıkUzun vadeli uygulama ve iyileştirmeler için iç ekibi eğittik

Sonuçlar:

Rotifer üretiminde 8 kata varan artışDöngüler boyunca larva sağlığında ve tutarlılığında iyileşmeİç ekip, sistemi bağımsız olarak yönetmek ve geliştirmek için gerekli araç ve bilgi birikimini kazandıTesiste gelecekteki Ar-Ge çalışmaları için tekrarlanabilir bir deneme modeli benimsendi`,

  "vars-strengthens-global-presence-at-bexco-fair-in-south-korea-3": `Güney Kore'deki Erişimimizi Genişletiyoruz

Güney Kore, sürdürülebilir ve yenilikçi çözümlere yönelik artan talebiyle su ürünleri yetiştiriciliğinin en önemli pazarlarından biridir. VARS, birinci sınıf su ürünleri yetiştiriciliği ürünleri ve hizmetleri sunma taahhüdünün bir parçası olarak, sektör liderleri, distribütörler ve potansiyel iş ortaklarıyla bir araya gelmek üzere BEXCO'ya katılmaktadır. Amacımız, uzmanlaşmış su ürünleri yetiştiriciliği çözümlerimizi, yenilikçi yemlerimizi ve sektörel birikimimizi Güney Kore'de daha geniş bir kitleyle buluşturmaktır.

BEXCO'da VARS'tan Neler Beklemelisiniz

BEXCO Fuarı'nda, sürdürülebilir yem, ileri yetiştiricilik teknikleri ve sektörel yenilikler dâhil olmak üzere su ürünleri yetiştiriciliği çözümlerimizin tamamını sergileyeceğiz. Uzman ekibimiz, Güney Koreli balık yetiştiricileri ve sektör profesyonelleri için sürdürülebilirliği, verimliliği ve kârlılığı artırmaya yönelik stratejileri görüşmek üzere hazır olacaktır.

Standımızı ziyaret edenleri bekleyenler:

Öncü çözümlerimizin canlı demonstrasyonlarıSu ürünleri yetiştiriciliği uzmanlarından oluşan ekibimizle iletişim ağı kurma fırsatlarıGüney Kore su ürünleri yetiştiriciliği işletmelerine özel çözümler üzerine görüşmelerSektörün sürdürülebilir büyümesini desteklemeye yönelik Ar-Ge girişimlerimize dair içgörüler

Gelecek İçin İş Ortaklıklarını Güçlendirmek

VARS, iş ortakları ve müşterileriyle uzun vadeli ilişkiler kurmayı her zaman öncelikli tutmuştur. Güney Kore, özellikle Kore kalkan balığı yetiştiriciliği alanında bizim için kilit bir pazar olmayı sürdürmektedir. BEXCO'ya katılarak, Güney Koreli su ürünleri yetiştiriciliği profesyonelleriyle iş birliğimizi derinleştirmeyi, dağıtım ağımızı güçlendirmeyi ve sektörün sürdürülebilir büyümesine katkıda bulunmayı hedefliyoruz.

BEXCO'da Bize Katılın!

Tüm sektör profesyonellerini, su ürünleri yetiştiriciliği uzmanlarını ve iş dünyası liderlerini Busan'daki BEXCO'da standımızı ziyaret etmeye davet ediyoruz. İster distribütör, ister balık yetiştiricisi olun, ister güvenilir su ürünleri yetiştiriciliği çözümleri arayan bir işletme olun, VARS ihtiyaçlarınızı karşılamaya ve olası iş birliklerini değerlendirmeye hazırdır.

📍 Etkinlik: BEXCO Fuarı, Busan, Güney Kore`,

  "our-journey-in-aquaculture-from-vision-to-industry-leader-in-live-feed-solutions-11": `Biyoteknoloji Vizyonundan Sektörel Yeniliğe

VARS Aquaculture Trading Company'nin hikâyesi, sürdürülebilir su ürünleri yetiştiriciliğine derin bir tutkuyla bağlı biyoteknoloji uzmanı Vahid'in vizyonu öncülüğünde 2016 yılında başladı. Misyonu açıktı: Türkiye'de ve ötesinde balık yetiştiricileri için kaliteyi, verimliliği ve kârlılığı artırarak kuluçkahanelerde canlı yem üretimini dönüştürmek.

Rotifer Üretiminde Devrim

İlk yıllarda VARS, larva balık beslenmesinin en kritik unsurlarından birine, yani rotiferlere odaklandı. Geleneksel rotifer üretim yöntemleri sınırlıydı ve tipik bir 3 günlük partide yalnızca 3,5 kat verim sağlıyordu. Kapsamlı Ar-Ge çalışmaları, küresel uzmanlarla iş birliği ve yılmadan sürdürülen deneyler sayesinde, aynı döngüde en az 8 kat rotifer verimi sağlayan özel bir üretim metodolojisi geliştirdik.

| Parametre | VARS Optimizasyonu Öncesi | VARS Optimizasyonu Sonrası |
| :--- | :--- | :--- |
| **Rotifer Verimi** | %350 | %800 |
| **DHA ve EPA Zenginleştirmesi** | Tutarsız | Stabil ve Güçlendirilmiş |
| **Siliat Kontaminasyonu** | Sık | Belirgin Şekilde Azaldı |
| **Kültürdeki Organik Kalıntı** | Yüksek | Düşük |

Bu optimizasyon maliyetleri düşürmüş, kaliteyi artırmış ve sektörde yeni standartlar belirlemiştir.

Artemia'ya Açılım: Doğal Bir Sonraki Adım

2017 yılına gelindiğinde ürün yelpazemiz, larva balıklar için bir diğer hayati canlı yem olan Artemia'yı da kapsayacak şekilde genişledi. Zengin besin profili ve kuluçkahane operasyonlarındaki esnekliğiyle tanınan Artemia, portföyümüzün temel taşlarından biri hâline geldi. İlk sevkiyatımızdan bu yana, güvenilir ve yüksek kaliteli Artemia tedariki konusundaki itibarımızı koruduk.

Rotiferler ve Artemia birlikte canlı yem ürün grubumuzun temelini oluşturmakta ve VARS'ı kuluçkahaneler için güvenilir bir iş ortağı hâline getirmektedir.

Sektör Liderlerinin Tercihi

Kılıç ve Gümüşdoğa başta olmak üzere Türkiye'nin önde gelen balık yetiştiricilik şirketlerine gururla hizmet veriyor; kuluçkahanelerini verimli, temiz ve besinsel olarak optimize edilmiş canlı yemlerle destekliyoruz. Müşterilerimiz bize yalnızca ürünlerimiz için değil; bilimsel yaklaşımımız, teknik uzmanlığımız ve sahadaki desteğimiz için de güveniyor.`,

  "moist-pellets-for-fish-superior-palatability-efficiency-easy-production-7": `Giriş

Nemli peletler, etçil ve hepçil balıklar için yüksek performanslı bir yem çözümü olarak öne çıkmıştır. Kuru peletlere göre daha yumuşak olan ve sıvı besin bakımından zengin bu peletler; lezzetlilik, değerlendirilme ve üretim esnekliği açısından kayda değer avantajlar sunar. Bu özellikleriyle levrek ve çipuradan alabalık ve pangasyusa kadar geniş bir su ürünleri yetiştiriciliği uygulama yelpazesi için idealdir.

### 1. Lezzetlilik: Karşı Konulmaz Bir Tat

Yumuşak dokusu ve yoğun "balıksı" aroması iştahı ve yem alımını belirgin biçimde artırırAraştırmalar, balıkların sert diyetler yerine nemli diyetleri tercih ettiğini ve bunun yemleme verimliliğini yükselttiğini göstermektedir

### 2. Yüksek Değerlendirilme: Daha Az Fire, Daha İyi Verim

Yem alım oranları %80-90'a ulaşır; bu, kuru yemlere kıyasla çarpıcı biçimde yüksektirYem artıkları, çöp balık kullanımında tipik olarak görülen miktarın yalnızca dörtte birine inerGelişmiş su stabilitesi ve azaltılmış besin sızıntısı, daha az besin kaybı ve daha iyi su kalitesi sağlar

### 3. Basitleştirilmiş ve Esnek Üretim

Bağışıklığı desteklemek ve hastalıkları önlemek için sıvı besin maddelerini veya ilaçları doğrudan peletlere entegre edinPüskürtmeli kurutma veya yüksek sıcaklıkta sterilizasyona gerek yoktur; böylece besin bozunması azalırKarmaşık peletleme makineleri yerine bir gıda öğütücü kullanarak yerinde üretimi kolaylaştırın

### 4. Besin Muhafazası ve Kalite Kontrolü

Hassas bileşenleri bozabilecek ısıtma/kurutma adımlarından kaçınınDoğal besin profillerini koruyun; vitaminleri, enzimleri ve yağları muhafaza edinYeniden işleme adımlarını ortadan kaldırın; yemleri taze ve doğrudan teslim edin

Temel Faydaların Özeti

FaydaSu Ürünleri Yetiştiriciliğine EtkisiLezzetlilikArtan yem alımı → daha iyi büyümeDeğerlendirilmeFirede azalma → iyileşen yem dönüşüm oranı (FCR)ÜretimDaha düşük maliyet, daha basit ekipman → esneklikBesin KorunumuDaha yüksek vitamin ve enzim muhafazası

📍 Neden Nemli Pelet?

Nemli peletler, operasyonel kolaylık ile biyolojik performansı ikna edici bir biçimde bir araya getirir:

Doğal doku ve aromalar daha yüksek yem alımı sağlarSindirilebilir ve suda stabildir; fireyi azaltırFonksiyonel katkı maddelerinin eklenmesi sorunsuz hâle gelirEndüstriyel makine gerektirmeden maliyet açısından verimli üretim`,
};
