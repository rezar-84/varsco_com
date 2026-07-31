import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/layout/Page";

export const Route = createFileRoute("/kvkk-disclosure-text")({
  head: () => ({
    meta: [
      { title: "KVKK Aydınlatma Metni | VARS Aquaculture" },
      {
        name: "description",
        content:
          "6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca VARS SU ÜRÜNLERİ İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ Aydınlatma Metni.",
      },
    ],
  }),
  component: () => (
    <LegalPage title="KVKK Aydınlatma Metni (Personal Data Protection)">
      <p className="text-xs text-muted-foreground font-semibold">
        Son Güncelleme Tarihi: 01/08/2025
      </p>

      <p>
        <strong>6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</strong> uyarınca,{" "}
        <strong>VARS SU ÜRÜNLERİ İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ</strong>{" "}
        (“Şirket” veya “VARS”) olarak, veri sorumlusu sıfatıyla, kişisel verilerinizin güvenliğine
        ve gizliliğine büyük önem vermekteyiz.
      </p>

      <h2>1. Veri Sorumlusunun Kimliği</h2>
      <p>
        <strong>Şirket Unvanı:</strong> VARS SU ÜRÜNLERİ İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED
        ŞİRKETİ
        <br />
        <strong>Adres:</strong> İsmet Kaptan Mah., Şair Eşref Blv. No:6 D:304/B, Konak, İzmir,
        35210, Türkiye
        <br />
        <strong>Vergi Dairesi & No:</strong> Konak V.D. 9240533729 | <strong>MERSİS No:</strong>{" "}
        0924053372900001
        <br />
        <strong>E-posta:</strong>{" "}
        <a href="mailto:privacy@varsco.com" className="text-primary font-bold">
          privacy@varsco.com
        </a>{" "}
        | <strong>Tel:</strong> +90 232 290 57 56
      </p>

      <h2>2. İşlenen Kişisel Verileriniz ve İşleme Amaçları</h2>
      <p>
        Aşağıdaki kişisel verileriniz KVKK Madde 5 ve Madde 6 uyarınca belirtilen amaçlarla
        işlenmektedir:
      </p>
      <ul>
        <li>
          <strong>Kimlik ve İletişim Bilgileri:</strong> Ad-soyad, kurumsal e-posta adresi, telefon
          numarası, görev unvanı (Sipariş doğrulama, teklif yönetimi ve müşteri hizmetleri için).
        </li>
        <li>
          <strong>Fatura ve Kurumsal Müşteri Bilgileri:</strong> Şirket unvanı, vergi dairesi, vergi
          numarası, fatura adresi (E-Fatura / E-Arşiv düzenlenmesi ve vergi mevzuatına uyum için).
        </li>
        <li>
          <strong>Ödeme Bilgileri:</strong> Kredi kartı ve işlem verileri (
          <strong>iyzico PCI-DSS sertifikalı altyapısı</strong> üzerinden güvenle işlenmekte olup
          Şirketimiz sunucularında saklanmaz).
        </li>
        <li>
          <strong>İşlem Güvenliği ve Lojistik Verileri:</strong> IP adresi, çerezler, teslimat ve
          soğuk zincir lojistik adresleri.
        </li>
      </ul>

      <h2>3. Kişisel Verilerin Aktarıldığı Taraflar ve Aktarım Amaçları</h2>
      <p>
        Kişisel verileriniz, mevzuatın izin verdiği hallerde ve gerekli güvenlik önlemleri alınarak
        aktarılır:
      </p>
      <ul>
        <li>
          Ürün gönderimi ve soğuk zincir nakliyesi için kargo, lojistik ve gümrük firmalarına,
        </li>
        <li>
          Ödeme işlemlerinin güvenle gerçekleştirilmesi için{" "}
          <strong>iyzico (İyzi Ödeme ve Elektronik Para Hizmetleri A.Ş.)</strong> altyapısına,
        </li>
        <li>
          Kanuni yükümlülüklerin yerine getirilmesi amacıyla Vergi Dairesi, Tarım ve Orman Bakanlığı
          il/ilçe müdürlükleri ve yetkili kamu kurumlarına.
        </li>
      </ul>

      <h2>4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
      <p>
        Verileriniz varsco.com web portalı, teklif formları, elektronik posta ve ticari iletişim
        kanalları aracılığıyla; KVKK 5. Maddesinde yer alan “Sözleşmenin kurulması ve ifası”,
        “Hukuki yükümlülüğün yerine getirilmesi” ve “Veri sorumlusunun meşru menfaati” hukuki
        sebeplerine dayalı olarak toplanmaktadır.
      </p>

      <h2>5. KVKK Madde 11 Kapsamındaki Haklarınız</h2>
      <p>KVKK'nın 11. maddesi uyarınca veri sahibi olarak Şirketimize başvurarak:</p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
        <li>Yurt içinde veya yurt dışında aktarıldığı 3. kişileri bilme,</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
        <li>
          KVKK 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,
        </li>
        <li>
          Düzeltme, silme ve yok edilme işlemlerinin verilerin aktarıldığı 3. kişilere
          bildirilmesini isteme hakkına sahipsiniz.
        </li>
      </ul>
      <p>
        Başvurularınızı ıslak imzalı dilekçe ile yukarıdaki şirket adresimize veya{" "}
        <strong>privacy@varsco.com</strong> e-posta adresimize iletebilirsiniz.
      </p>
    </LegalPage>
  ),
});
