import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/layout/Page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/context/I18nContext";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | VARS Aquaculture B2B" },
      {
        name: "description",
        content:
          "Find answers regarding B2B orders, salmon ova cold-chain delivery, minimum order quantities (MOQ), TRACES certification, and international shipping protocols.",
      },
    ],
  }),
  component: FAQs,
});

function FAQs() {
  const { t } = useI18n();

  const FAQ = [
    {
      q: t("faqsPage.items.moq.q"),
      a: t("faqsPage.items.moq.a"),
    },
    {
      q: t("faqsPage.items.payment.q"),
      a: t("faqsPage.items.payment.a"),
    },
    {
      q: t("faqsPage.items.shipping.q"),
      a: t("faqsPage.items.shipping.a"),
    },
    {
      q: t("faqsPage.items.coldChain.q"),
      a: t("faqsPage.items.coldChain.a"),
    },
    {
      q: t("faqsPage.items.sample.q"),
      a: t("faqsPage.items.sample.a"),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("faqsPage.hero.eyebrow")}
        title={t("faqsPage.hero.title")}
        description={t("faqsPage.hero.description")}
      />
      <Section>
        <Accordion type="single" collapsible className="max-w-3xl">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`i${i}`}>
              <AccordionTrigger className="text-left font-display text-lg text-navy">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </>
  );
}
