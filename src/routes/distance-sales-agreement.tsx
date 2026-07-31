import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/layout/Page";

export const Route = createFileRoute("/distance-sales-agreement")({
  head: () => ({
    meta: [
      { title: "Mesafeli Satış Sözleşmesi | VARS Aquaculture" },
      {
        name: "description",
        content:
          "VARS SU ÜRÜNLERİ İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ Mesafeli Satış Sözleşmesi ve B2B ticari teslimat şartları.",
      },
    ],
  }),
  component: () => (
    <LegalPage title="Mesafeli Satış Sözleşmesi (Distance Sales Agreement)">
      <p className="text-xs text-muted-foreground font-semibold">
        Son Güncelleme Tarihi: 01/08/2025
      </p>

      <h2>1. Taraflar</h2>
      <p>
        İşbu Mesafeli Satış Sözleşmesi (“Sözleşme”), aşağıdaki taraflar arasında elektronik ortamda
        onaylanmak suretiyle akdedilmiştir:
      </p>

      <div className="my-4 rounded-2xl bg-surface-alt p-5 border border-border space-y-2 text-xs">
        <p className="font-bold text-navy uppercase tracking-wider">SATICI BİLGİLERİ</p>
        <p>
          <strong>Unvan:</strong> VARS SU ÜRÜNLERİ İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ
        </p>
        <p>
          <strong>Adres:</strong> İsmet Kaptan Mah., Şair Eşref Blv. No:6 D:304/B, Konak, İzmir,
          35210, Türkiye
        </p>
        <p>
          <strong>Vergi Dairesi & No:</strong> Konak V.D. 9240533729 | <strong>MERSİS No:</strong>{" "}
          0924053372900001
        </p>
        <p>
          <strong>Telefon:</strong> +90 232 290 57 56 | <strong>E-posta:</strong> info@varsco.com
        </p>
      </div>

      <div className="my-4 rounded-2xl bg-surface-alt p-5 border border-border space-y-2 text-xs">
        <p className="font-bold text-navy uppercase tracking-wider">ALICI BİLGİLERİ</p>
        <p>
          varsco.com portalı üzerinden sipariş veren veya teklif / proforma faturayı elektronik
          ortamda onaylayan kurumsal veya bireysel alıcı (“Alıcı”).
        </p>
      </div>

      <h2>2. Sözleşmenin Konusu</h2>
      <p>
        İşbu Sözleşme'nin konusu, Alıcı'nın Satıcı'ya ait varsco.com web sitesinden veya B2B teklif
        kanallarından siparişini verdiği su ürünleri, canlı yem (Artemia, Chlorella), kuluçkahane
        girdileri, somon yumurtaları ve yem katkı maddelerinin satışı ve teslimi ile ilgili olarak
        6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği ile
        Türk Ticaret Kanunu hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
      </p>

      <h2>3. Ödeme ve İşlem Güvenliği</h2>
      <p>
        Sipariş bedeli online ödemelerde{" "}
        <strong>iyzico (İyzi Ödeme ve Elektronik Para Hizmetleri A.Ş.)</strong> PCI-DSS Level 1
        sertifikalı altyapısı üzerinden kredi kartı / banka kartı ile veya banka havalesi (SWIFT /
        EFT) yoluyla tahsil edilir. Kredi kartı bilgileri Satıcı sunucularında saklanmaz.
      </p>

      <h2>4. Teslimat Şartları ve Soğuk Zincir Prosedürleri</h2>
      <ul>
        <li>
          Ürünler sipariş konfirmasyonunda ve proforma faturada belirtilen Incoterm (FOB, CIF, EXW,
          CIP) esaslarına göre teslim edilir.
        </li>
        <li>
          Biyolojik canlı ürünler ve somon yumurtaları İzmir Adnan Menderes Havalimanı (ADB) çıkışlı
          özel soğuk zincir strafor kutularda ve sıcaklık veri kayıt cihazları (data logger) ile
          sevk edilir.
        </li>
        <li>
          Gümrük işlemleri, veteriner sağlık sertifikaları ve TRACES belgeleri ihracat
          standartlarına uygun olarak düzenlenir.
        </li>
      </ul>

      <h2>5. Cayma Hakkı ve İade Şartları</h2>
      <p>
        6502 Sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği Madde 15 uyarınca;{" "}
        <strong>
          çabuk bozulma tehlikesi olan, son kullanma tarihi geçme ihtimali bulunan veya canlı yem /
          dondurulmuş / soğuk zincir gerektiren biyolojik ürünlerde cayma hakkı kullanılamaz.
        </strong>
      </p>
      <p>
        Kuru yem katkıları ve ekipman iadelerinde; ambalajın açılmamış, bozulmamış ve yeniden
        satılabilir nitelikte olması şartıyla iade prosedürü Satıcı onayı ile yürütülür.
      </p>

      <h2>6. Yetkili Mahkeme</h2>
      <p>
        İşbu Sözleşme'den doğabilecek uyuşmazlıklarda Türk Hukuku uygulanır ve{" "}
        <strong>İzmir Mahkemeleri ve İcra Daireleri</strong> yetkilidir.
      </p>
    </LegalPage>
  ),
});
