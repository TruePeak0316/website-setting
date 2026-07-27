import { CalculatorSwitcher } from "@/components/calculators/CalculatorSwitcher";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";

export default function CaculatorsPage() {
  return (
    <SiteLayout>
      <Seo title="計算小工具" path="/caculators" description="提供發票營業稅、租金扣繳與二代健保補充保費試算，方便您比較含稅、未稅及不同租賃情境的計算結果。" />
      <PageHero title="計算小工具" description="快速試算常見發票與租金扣繳情境，協助您先掌握大致金額。" image="/images/Accounting Management.webp" />
      <section className="section-pad bg-brand-cream">
        <div className="page-shell">
          <CalculatorSwitcher />
        </div>
      </section>
    </SiteLayout>
  );
}
