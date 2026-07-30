import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Certificate,
  Check,
  EnvelopeSimple,
  GraduationCap,
  Lightbulb,
  Phone,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Seo } from "@/components/layout/Seo";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/ui/PageHero";
import type { TeamProfile } from "@/lib/team";

function ProfileSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="flex items-center gap-3 text-xl font-bold text-brand-charcoal">
        <span className="text-brand-primary" aria-hidden="true">
          {icon}
        </span>
        <span>{title}</span>
      </h2>
      <div className="mt-4 text-[15px] leading-8 text-zinc-700">{children}</div>
    </section>
  );
}

function ProfileList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function TeamMemberCard({ profile }: { profile: TeamProfile }) {
  return (
    <article className="group/card w-full max-w-[250px] overflow-hidden rounded-[4px] border border-brand-light/45 bg-white shadow-[0_18px_60px_rgb(7_86_111_/_0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgb(7_86_111_/_0.16)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-light/35">
        <Image
          src={profile.image}
          alt={`${profile.name}${profile.role}`}
          fill
          sizes="250px"
          className="object-cover transition duration-700 group-hover/card:scale-[1.03]"
          style={{ objectPosition: profile.imagePosition }}
        />
        <p className="absolute bottom-0 left-0 rounded-tr-[4px] bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white">
          {profile.role}
        </p>
      </div>
      <Link
        href={`/team/${profile.slug}`}
        className="group/info relative isolate flex items-center justify-between gap-4 overflow-hidden px-3 py-3 text-brand-dark"
        aria-label={`查看${profile.name}介紹`}
      >
        <span
          className="absolute inset-y-0 left-0 z-0 w-0 bg-brand-primary transition-[width] duration-500 ease-out group-hover/info:w-full"
          aria-hidden="true"
        />
        <h2 className="relative z-10 text-lg font-bold transition-colors duration-300 group-hover/info:text-white">
          {profile.name}
        </h2>
        <span
          className="relative z-10 text-brand-dark transition-colors duration-300 group-hover/info:text-white"
          aria-hidden="true"
        >
          <ArrowRight size={18} weight="bold" />
        </span>
      </Link>
    </article>
  );
}

export function TeamProfilePage({ profile }: { profile: TeamProfile }) {
  const hasContact = profile.contact?.phone || profile.contact?.email;

  return (
    <SiteLayout>
      <Seo
        title={`${profile.name}｜${profile.role}`}
        path={`/team/${profile.slug}`}
        description={`${profile.name}${profile.role}的資格、學歷、經歷與專長介紹。`}
      />
      <PageHero
        title={
          <>
            專業團隊 &gt;{" "}
            <span className="hero-gradient-text-on-dark">{profile.name}</span>
          </>
        }
        image="/images/home-trust-team.webp"
      />
      <section
        className="section-pad bg-white"
        aria-label={`${profile.name}專業介紹內容區`}
      >
        <div className="page-shell grid gap-12 lg:grid-cols-[350px_minmax(0,1fr)] lg:items-start lg:gap-20">
          <div className="mx-auto w-full max-w-[350px] lg:mx-0">
            <div className="relative aspect-square w-full overflow-hidden rounded-[4px] bg-brand-light/35">
              <Image
                src={profile.image}
                alt={`${profile.name}${profile.role}`}
                fill
                sizes="(min-width: 1024px) 350px, 100vw"
                className="object-cover"
                style={{ objectPosition: profile.imagePosition }}
                priority
              />
            </div>
            <div className="pt-5">
              <p className="text-sm font-medium text-brand-primary">
                {profile.role}
              </p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-brand-charcoal">
                {profile.name}
              </h2>
            </div>
            {hasContact ? (
              <div className="mt-6 border-t border-brand-light/40 pt-5">
                <div className="grid gap-3 text-sm text-brand-dark">
                  {profile.contact?.phone ? (
                    <a
                      href={profile.contact.phone.href}
                      className="inline-flex items-center gap-3 transition-colors hover:text-brand-primary"
                    >
                      <Phone size={17} weight="regular" aria-hidden="true" />
                      <span>{profile.contact.phone.label}</span>
                    </a>
                  ) : null}
                  {profile.contact?.email ? (
                    <a
                      href={profile.contact.email.href}
                      className="inline-flex items-center gap-3 transition-colors hover:text-brand-primary"
                    >
                      <EnvelopeSimple
                        size={17}
                        weight="regular"
                        aria-hidden="true"
                      />
                      <span>{profile.contact.email.label}</span>
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-10">
            <ProfileSection
              title="資格"
              icon={<Certificate size={23} weight="regular" />}
            >
              <ProfileList items={profile.qualifications} />
            </ProfileSection>

            <ProfileSection
              title="學歷"
              icon={<GraduationCap size={23} weight="regular" />}
            >
              <ProfileList items={profile.education} />
            </ProfileSection>

            <ProfileSection
              title="經歷"
              icon={<Briefcase size={23} weight="regular" />}
            >
              <ProfileList items={profile.experience} />
            </ProfileSection>

            <ProfileSection
              title="專長"
              icon={<Lightbulb size={23} weight="regular" />}
            >
              <ul className="space-y-1">
                {profile.specialties.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check
                      size={16}
                      weight="bold"
                      className="mt-1 shrink-0 text-brand-primary"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ProfileSection>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
