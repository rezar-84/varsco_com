import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/layout/Page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service (ToS) | VARS Aquaculture" },
      {
        name: "description",
        content:
          "Official Terms of Service of VARS SU ÜRÜNLERİ İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ governing B2B commercial transactions and website usage.",
      },
    ],
  }),
  component: () => (
    <LegalPage title="Terms of Service (ToS)">
      <p className="text-xs text-muted-foreground font-semibold">Effective Date: 01/08/2025</p>

      <h2>1. Introduction</h2>
      <p>
        These Terms of Service (“Terms”) govern your access to and use of the website and commercial
        services provided by{" "}
        <strong>VARS SU ÜRÜNLERİ İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ</strong> (“VARS”,
        “we”, “us”).
      </p>
      <p>
        By accessing{" "}
        <a
          href="https://varsco.com"
          className="text-primary font-bold hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          varsco.com
        </a>{" "}
        or submitting purchase orders, you agree to comply with:
      </p>
      <ul>
        <li>These Terms of Service</li>
        <li>
          Our Privacy Policy:{" "}
          <Link to="/privacy" className="text-primary font-bold hover:underline">
            /privacy
          </Link>
        </li>
        <li>
          Our KVKK Disclosure Text:{" "}
          <Link to="/kvkk-disclosure-text" className="text-primary font-bold hover:underline">
            /kvkk-disclosure-text
          </Link>
        </li>
        <li>
          Our Distance Sales Agreement (where applicable):{" "}
          <Link to="/distance-sales-agreement" className="text-primary font-bold hover:underline">
            /distance-sales-agreement
          </Link>
        </li>
      </ul>

      <h2>2. Company Information</h2>
      <p>
        <strong>Company Name:</strong> VARS SU ÜRÜNLERİ İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED
        ŞİRKETİ
      </p>
      <p>
        <strong>Address:</strong> İsmet Kaptan Mah., Şair Eşref Blv. No:6 D:304/B, Konak, İzmir,
        35210, Türkiye
      </p>
      <p>
        <strong>Tax Office & Tax ID:</strong> Konak V.D. 9240533729 | <strong>MERSIS No:</strong>{" "}
        0924053372900001
      </p>
      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:info@varsco.com" className="text-primary font-bold">
          info@varsco.com
        </a>{" "}
        | <strong>Phone:</strong> +90 232 290 57 56
      </p>

      <h2>3. Scope of Services</h2>
      <p>VARS provides institutional-grade B2B aquaculture inputs and services, including:</p>
      <ul>
        <li>
          High-performance live feed (Artemia cysts, Decapsulated Artemia, Chlorella, rotifer
          enrichments)
        </li>
        <li>Certified salmonid ova & fertilized Atlantic / Coho / Rainbow Trout eggs</li>
        <li>Feed additives, raw ingredients (wheat gluten, fish meal/oil substitutes)</li>
        <li>Commercial seafood export (Aegean Sea Bass, Sea Bream, Trout, Tuna feed)</li>
        <li>Hatchery engineering design and Recirculating Aquaculture System (RAS) consulting</li>
      </ul>

      <h2>4. Relationship with Other Agreements</h2>
      <p>
        Specific commercial transactions may be governed by individual proforma invoices, sales
        contracts, or Distance Sales Agreements. In case of conflict, signed specific commercial
        contracts take precedence.
      </p>

      <h2>5. User Obligations</h2>
      <p>
        Users and purchasing agents agree to provide accurate corporate registration details,
        maintain credentials securely, and utilize products solely for legitimate aquaculture
        operations.
      </p>

      <h2>6. Orders & Commercial Terms</h2>
      <p>
        All quotation requests, proforma invoices, and purchase orders are confirmed upon written
        acceptance and validation by VARS export management.
      </p>

      <h2>7. Payment Terms</h2>
      <p>
        Online payments are securely processed via{" "}
        <strong>iyzico PCI-DSS Level 1 infrastructure</strong> accepting major credit cards (Visa,
        Mastercard, Troy, AMEX). Commercial bank transfers (SWIFT / EFT / Wire) must reference the
        official proforma invoice number.
      </p>

      <h2>8. Shipping & Risk Transfer</h2>
      <p>
        Deliveries are executed under international Incoterms (FOB, CIF, EXW, CIP). Risk transfers
        according to the specified Incoterm. Temperature data loggers verify cold-chain integrity
        during air freight and reefer cargo transport.
      </p>

      <h2>9. Product Use & Technical Responsibility</h2>
      <p>
        Live feed and biological inputs require compliance with VARS biological protocols. VARS
        provides technical guidelines but ultimate farm management rests with the buyer.
      </p>

      <h2>10. Intellectual Property</h2>
      <p>
        All trademarks, logos, REVIVE™ brand assets, and proprietary technical guides are the sole
        property of VARS Su Ürünleri Ltd. Şti.
      </p>

      <h2>11. Personal Data Protection (KVKK)</h2>
      <p>
        Personal data collected during commercial interactions is processed under KVKK Law No. 6698
        and GDPR guidelines as detailed in our Privacy Policy.
      </p>

      <h2>12. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, VARS is not liable for indirect, incidental, or
        consequential damages resulting from improper storage, biological misuse, or farm management
        errors beyond stated specifications.
      </p>

      <h2>13. Warranty Disclaimer</h2>
      <p>
        Products meet stated lab certificates (CoA) at dispatch. Due to biological live-feed
        variables, batch parameters are verified prior to shipment.
      </p>

      <h2>14. Compliance with Laws</h2>
      <p>
        Both parties agree to comply with international trade, customs regulations, veterinary
        health laws, and anti-corruption standards.
      </p>

      <h2>15. Force Majeure</h2>
      <p>
        Neither party is liable for failure or delay caused by events beyond reasonable control,
        including severe weather, airspace closures, pandemic quarantine, or war.
      </p>

      <h2>16. Termination</h2>
      <p>
        VARS reserves the right to suspend or terminate services or user access for material breach
        of these Terms or non-payment.
      </p>

      <h2>17. Governing Law & Jurisdiction</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the Republic
        of Türkiye. Any disputes shall be submitted to the exclusive jurisdiction of the{" "}
        <strong>İzmir Central Courts and Execution Offices</strong>.
      </p>

      <h2>18. Changes to Terms</h2>
      <p>
        VARS reserves the right to modify these Terms at any time. Continued use of the portal
        constitutes acceptance of updated Terms.
      </p>

      <h2>19. Contact Information</h2>
      <p>
        For legal inquiries, contact us at{" "}
        <a href="mailto:info@varsco.com" className="text-primary font-bold hover:underline">
          info@varsco.com
        </a>{" "}
        or +90 232 290 57 56.
      </p>
    </LegalPage>
  ),
});
