import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { TRUST_METRICS } from "@/lib/content";

export function TrustScaleSection() {
  return (
    <section aria-labelledby="home-trust-title" className="relative grid bg-brand-primary lg:grid-cols-[37.5%_62.5%]">
      <div className="relative h-[clamp(320px,58dvh,520px)] overflow-hidden bg-[#aeb7c8] lg:h-auto lg:self-stretch">
        <Image
          src="/images/home-trust-team-mobile.webp"
          alt="彭裕峰會計師與陳滿景記帳士專業形象照"
          fill
          sizes="100vw"
          className="object-cover object-center lg:hidden"
        />
        <Image
          src="/images/home-trust-team.webp"
          alt="彭裕峰會計師與陳滿景記帳士專業形象照"
          fill
          sizes="37.5vw"
          className="hidden object-cover object-top lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            backgroundAttachment: "fixed",
            backgroundImage: 'url("/images/home-trust-team.webp")',
            backgroundPosition: "left 72px",
            backgroundRepeat: "no-repeat",
            backgroundSize: "max(37.5vw, 430px) auto",
          }}
        />
      </div>

      <div className="flex items-center bg-brand-primary px-6 py-14 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-12 xl:px-20">
        <div className="w-full max-w-2xl">
          <p className="text-sm font-semibold text-brand-light">關於誠峰</p>
          <h2 id="home-trust-title" className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
            專業服務與在地累積
          </h2>
          <p className="mt-5 max-w-[52ch] text-base leading-8 text-white/85">
            從在地帳務服務到會計師專業判斷，誠峰以清楚溝通與穩定流程，陪伴企業處理每一項重要決策。
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-12">
            {TRUST_METRICS.map((metric) => (
              <div key={metric.label}>
                <dt className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{metric.value}</dt>
                <dd className="mt-2 text-sm font-semibold leading-6 text-white/90">{metric.label}</dd>
              </div>
            ))}
          </dl>

          <Link
            href="/about"
            className="mt-10 inline-flex min-h-12 items-center justify-center gap-2 border border-white/80 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-px"
          >
            認識誠峰
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
