import { InvoiceCalculator } from "@/components/calculators/InvoiceCalculator";
import { RentCalculator } from "@/components/calculators/RentCalculator";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";

export default function CaculatorsPage() {
  return (
    <SiteLayout>
      <Seo title="計算小工具" path="/caculators" description="提供發票營業稅金額、租金扣繳與二代健保補充保費試算工具。" />
      <PageHero title="計算小工具" description="快速試算常見發票與租金扣繳情境，協助您先掌握大致金額。" image="/images/Accounting Management.jpg" />
      <section className="section-pad bg-brand-cream">
        <div className="page-shell space-y-8">
          <InvoiceCalculator />
          <RentCalculator />
        </div>
      </section>
    </SiteLayout>
  );
}
