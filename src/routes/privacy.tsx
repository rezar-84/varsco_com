import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/layout/Page";
import { useI18n } from "@/context/I18nContext";
import { getCurrentLocale } from "@/lib/utils/locale";

/**
 * Bilingual legal page.
 *
 * Legal copy is kept as JSX here rather than in the locale JSON: it is
 * long-form structured prose (headings, lists, inline emphasis and links), and
 * flattening it into key/value strings would both mangle the structure and
 * make review by a lawyer impractical. Turkish is the authoritative version —
 * VARS is an İzmir company and KVKK is Turkish law — with English served to
 * every other locale as the working translation for international buyers.
 *
 * Statutory identifiers (tax ID, MERSİS, registered address) are identical in
 * both versions and match the other three legal routes.
 */
export const Route = createFileRoute("/privacy")({
  head: () => {
    const tr = getCurrentLocale() === "tr";
    return {
      meta: [
        {
          title: tr
            ? "Gizlilik Politikası | VARS Aquaculture"
            : "Privacy Policy | VARS Aquaculture",
        },
        {
          name: "description",
          content: tr
            ? "VARS SU ÜRÜNLERİ İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ'nin 6698 sayılı KVKK ve GDPR uyumlu resmî Gizlilik Politikası."
            : "Official Privacy Policy of VARS SU ÜRÜNLERİ İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ in compliance with KVKK (Law No. 6698) and GDPR.",
        },
      ],
    };
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  const { lang } = useI18n();
  return lang === "tr" ? <PrivacyTr /> : <PrivacyEn />;
}

function CorporateDetailsTr() {
  return (
    <div className="mt-8 rounded-2xl bg-surface-alt p-6 border border-border space-y-2 text-xs">
      <h3 className="font-display text-sm font-bold text-navy uppercase tracking-wider">
        Veri Sorumlusu Kurumsal Bilgileri
      </h3>
      <p className="font-bold text-navy">
        VARS SU ÜRÜNLERİ İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ
      </p>
      <p>İsmet Kaptan Mah., Şair Eşref Blv. No:6 D:304/B, Konak, İzmir, 35210, Türkiye</p>
      <p>Vergi Kimlik No: 9240533729 | MERSİS: 0924053372900001</p>
      <p>
        📧 E-posta:{" "}
        <a href="mailto:privacy@varsco.com" className="text-primary font-bold">
          privacy@varsco.com
        </a>{" "}
        | 📞 Tel: +90 232 290 57 56
      </p>
    </div>
  );
}

function PrivacyTr() {
  return (
    <LegalPage title="Gizlilik Politikası">
      <p className="text-xs text-muted-foreground font-semibold">Yürürlük Tarihi: 01/08/2025</p>
      <p>
        <strong>VARS Aquaculture</strong> (“Şirket”, “biz” veya “VARS”) gizliliğinize ve veri
        güvenliğinize önem vermektedir. İşbu Gizlilik Politikası;{" "}
        <a href="https://varsco.com" className="text-primary font-bold hover:underline">
          varsco.com
        </a>{" "}
        web sitemizi ziyaret ettiğinizde, B2B hizmetlerimizden yararlandığınızda veya ürünlerimizi
        satın aldığınızda kişisel verilerinizi{" "}
        <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</strong>,{" "}
        <strong>Genel Veri Koruma Tüzüğü (GDPR)</strong> ve ilgili uluslararası ticari mevzuata
        uygun olarak nasıl topladığımızı, kullandığımızı, sakladığımızı ve koruduğumuzu
        açıklamaktadır.
      </p>

      <h2>1. Topladığımız Bilgiler</h2>
      <p>
        <strong>A. Kişisel Veriler</strong>
      </p>
      <ul>
        <li>Ad soyad ve kurumsal unvan</li>
        <li>Kurumsal e-posta adresi ile telefon / WhatsApp numaraları</li>
        <li>Şirket unvanı, vergi dairesi ve vergi kimlik numarası (B2B faturalandırma için)</li>
        <li>Soğuk zincir ve kuru yük teslimatı için sevkiyat ve fatura adresleri</li>
        <li>
          Ödeme işlem verileri (<strong>iyzico PCI-DSS sertifikalı altyapısı</strong> üzerinden
          güvenli şekilde işlenir, sunucularımızda saklanmaz)
        </li>
      </ul>
      <p>
        <strong>B. Kişisel Olmayan ve Teknik Veriler</strong>
      </p>
      <ul>
        <li>IP adresi, tarayıcı türü, işletim sistemi</li>
        <li>Cihaz bilgileri ve oturum telemetrisi</li>
        <li>Çerezler ve site kullanım verileri (ziyaret edilen sayfalar, yönlendiren kaynaklar)</li>
      </ul>

      <h2>2. Bilgilerinizi Nasıl Kullanıyoruz?</h2>
      <ul>
        <li>
          B2B satın alma siparişlerini ve teklif taleplerini işlemek, doğrulamak ve sevk etmek
        </li>
        <li>Müşteri hizmetleri, teknik kuluçkahane desteği ve SLA takibi sağlamak</li>
        <li>
          Türk vergi ve ticaret mevzuatı kapsamında yasal E-fatura / E-arşiv belgeleri düzenlemek
        </li>
        <li>Gümrük, veteriner ihracat sertifikaları ve düzenleyici gerekliliklere uyum sağlamak</li>
        <li>Teknik güncellemeler ve tanıtım bültenleri göndermek (açık rızanıza bağlı olarak)</li>
      </ul>

      <h2>3. Bilgilerin Paylaşılması</h2>
      <p>Kişisel verilerinizi yalnızca ilgili mevzuata tam uygunlukla paylaşırız:</p>
      <ul>
        <li>Sipariş ifası için soğuk zincir lojistiği ve hava kargo taşıyıcılarıyla</li>
        <li>
          PCI-DSS güvenli kart işlemleri için ödeme hizmeti sağlayıcılarıyla (
          <strong>iyzico</strong>)
        </li>
        <li>Yetkili bölgesel satış birimleri ve dağıtım iş ortaklarıyla</li>
        <li>
          Mevzuatın zorunlu kıldığı hâllerde vergi daireleri, veteriner müdürlükleri ve yasal
          mercilerle
        </li>
      </ul>
      <p className="font-bold text-navy">
        Kişisel verilerinizi ÜÇÜNCÜ TARAFLARA HİÇBİR ZAMAN satmaz, kiralamaz veya devretmeyiz.
      </p>

      <h2>4. Veri Güvenliği</h2>
      <ul>
        <li>Tüm web iletimi için 256 bit SSL şifreleme</li>
        <li>Yetkisiz erişime karşı sıkı idari ve teknik tedbirler</li>
        <li>
          Çevrimiçi ödeme işlemleri <strong>PCI-DSS Seviye 1 sertifikalı iyzico altyapısı</strong>{" "}
          üzerinden işlenir
        </li>
        <li>
          Veriler <strong>6698 sayılı KVKK</strong> ve GDPR saklama standartlarına uygun olarak
          muhafaza edilir
        </li>
      </ul>

      <h2>5. Çerezler</h2>
      <p>
        Kullanıcı deneyimini iyileştirmek, dil tercihlerini saklamak ve site performansını analiz
        etmek amacıyla zorunlu ve analitik çerezler kullanıyoruz. Çerez ayarlarınızı tarayıcı
        tercihleriniz üzerinden değiştirebilirsiniz.
      </p>

      <h2>6. Haklarınız</h2>
      <p>KVKK ve GDPR kapsamında aşağıdaki haklara sahipsiniz:</p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme ve bunlara erişim talep etme</li>
        <li>Yanlış veya eksik kişisel verilerin düzeltilmesini talep etme</li>
        <li>
          Verilerin silinmesini veya yok edilmesini talep etme (yasal vergi saklama yükümlülükleri
          saklı kalmak kaydıyla)
        </li>
        <li>Otomatik işlemeye itiraz etme veya pazarlama rızasını geri çekme</li>
      </ul>
      <p>
        Haklarınızı kullanmak için veri sorumlumuza{" "}
        <a href="mailto:privacy@varsco.com" className="text-primary font-bold hover:underline">
          privacy@varsco.com
        </a>{" "}
        adresinden e-posta gönderebilirsiniz.
      </p>

      <h2>7. Güncellemeler</h2>
      <p>
        İşbu politika dönemsel olarak güncellenebilir. En güncel sürüm, güncellenmiş yürürlük tarihi
        ile birlikte her zaman portalımızda erişilebilir olacaktır.
      </p>

      <CorporateDetailsTr />
    </LegalPage>
  );
}

function PrivacyEn() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="text-xs text-muted-foreground font-semibold">Effective Date: 01/08/2025</p>
      <p>
        <strong>VARS Aquaculture</strong> (“Company”, “we”, “our” or “VARS”) values your privacy and
        data security. This Privacy Policy explains how we collect, use, store, and protect your
        personal data in compliance with the{" "}
        <strong>Turkish Personal Data Protection Law (KVKK - Law No. 6698)</strong>, the{" "}
        <strong>General Data Protection Regulation (GDPR)</strong>, and applicable international
        commercial regulations when you visit our website{" "}
        <a href="https://varsco.com" className="text-primary font-bold hover:underline">
          varsco.com
        </a>
        , use our B2B services, or purchase our products.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        <strong>A. Personal Data</strong>
      </p>
      <ul>
        <li>Full name and corporate position</li>
        <li>Corporate email address and telephone / WhatsApp numbers</li>
        <li>Company name, Tax Office, Tax ID (for B2B invoicing)</li>
        <li>Shipping and billing addresses for cold-chain and dry cargo delivery</li>
        <li>
          Payment transaction data (processed securely via{" "}
          <strong>iyzico PCI-DSS certified infrastructure</strong>, never stored on our servers)
        </li>
      </ul>
      <p>
        <strong>B. Non-Personal & Technical Data</strong>
      </p>
      <ul>
        <li>IP address, browser type, operating system</li>
        <li>Device information and session telemetry</li>
        <li>Cookies and site usage data (pages visited, referral sources)</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To process, verify, and dispatch B2B purchase orders and quote requests</li>
        <li>To provide customer service, technical hatchery support, and SLA tracking</li>
        <li>To issue legal E-fatura / E-arşiv invoices under Turkish tax and commerce laws</li>
        <li>To comply with customs, veterinary export certificates, and regulatory requirements</li>
        <li>To send technical updates and promotional bulletins (with explicit opt-in consent)</li>
      </ul>

      <h2>3. Sharing of Information</h2>
      <p>We only share your personal data in strict compliance with applicable laws:</p>
      <ul>
        <li>With cold-chain logistics and air-cargo carriers for order fulfillment</li>
        <li>
          With payment service providers (<strong>iyzico</strong>) for PCI-DSS secure card
          processing
        </li>
        <li>With authorized regional sales desks and distribution partners</li>
        <li>With tax offices, veterinary directors, and legal authorities when mandated by law</li>
      </ul>
      <p className="font-bold text-navy">
        We NEVER sell, rent, or lease your personal data to third parties.
      </p>

      <h2>4. Data Security</h2>
      <ul>
        <li>256-Bit SSL encryption for all web transmission</li>
        <li>Strict administrative and technical measures against unauthorized access</li>
        <li>
          Online payment transactions are processed via{" "}
          <strong>PCI-DSS Level 1 certified iyzico infrastructure</strong>
        </li>
        <li>
          Data stored in compliance with <strong>KVKK (Law No. 6698)</strong> and GDPR retention
          standards
        </li>
      </ul>

      <h2>5. Cookies</h2>
      <p>
        We use essential and analytics cookies to optimize user experience, store language
        preferences, and analyze site performance. You can adjust cookie settings via your browser
        preferences.
      </p>

      <h2>6. Your Rights</h2>
      <p>Under KVKK and GDPR, you have the right to:</p>
      <ul>
        <li>Learn whether your personal data is processed and request access</li>
        <li>Request correction of inaccurate or incomplete personal data</li>
        <li>Request deletion or destruction of data (subject to statutory tax retention rules)</li>
        <li>Object to automated processing or withdraw marketing consent</li>
      </ul>
      <p>
        To exercise your rights, email our data controller at{" "}
        <a href="mailto:privacy@varsco.com" className="text-primary font-bold hover:underline">
          privacy@varsco.com
        </a>
        .
      </p>

      <h2>7. Updates</h2>
      <p>
        This policy may be updated periodically. The latest version will always be accessible on our
        portal with an updated effective date.
      </p>

      <div className="mt-8 rounded-2xl bg-surface-alt p-6 border border-border space-y-2 text-xs">
        <h3 className="font-display text-sm font-bold text-navy uppercase tracking-wider">
          Corporate Data Controller Details
        </h3>
        <p className="font-bold text-navy">
          VARS SU ÜRÜNLERİ İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ
        </p>
        <p>İsmet Kaptan Mah., Şair Eşref Blv. No:6 D:304/B, Konak, İzmir, 35210, Türkiye</p>
        <p>Tax ID: 9240533729 | MERSIS: 0924053372900001</p>
        <p>
          📧 Email:{" "}
          <a href="mailto:privacy@varsco.com" className="text-primary font-bold">
            privacy@varsco.com
          </a>{" "}
          | 📞 Tel: +90 232 290 57 56
        </p>
      </div>
    </LegalPage>
  );
}
