import { CONTACT_EMAIL, OWNER, X_PROFILE_URL } from "@/lib/site";
import { GlassPanel } from "@/components/glass-panel";
import { PageHeading } from "@/components/page-heading";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
      <div className="mt-2 space-y-3 leading-relaxed text-ink/85">{children}</div>
    </section>
  );
}

export function AboutPage() {
  return (
    <GlassPanel className="mx-auto max-w-3xl p-6 sm:p-8">
      <PageHeading title="About Stackwise" description="Research before you pay." />
      <Block title="What Stackwise is">
        <p>
          Stackwise explains crypto, AI and SaaS tools in plain English: what a product does, who it is for, what it
          costs, and what to check before you pay for it or connect a wallet.
        </p>
      </Block>
      <Block title="How we research">
        <p>
          We read official documentation, pricing pages and terms, published security audits, public incident history,
          and what real users say in public. Posts link to the sources they rely on where possible, and show when they
          were last updated.
        </p>
      </Block>
      <Block title="What we do not do">
        <p>
          We do not buy or run every product we write about. Unless a post says otherwise, we have not used the product
          ourselves. We do not give financial, investment or legal advice, and nothing here is a promise or a guarantee.
        </p>
      </Block>
      <Block title="Affiliate links">
        <p>
          Some links are affiliate links. If you use one, Stackwise may earn a commission at no extra cost to you. A
          commission does not change what a post says.
        </p>
      </Block>
      <Block title="Do your own research">
        <p>
          Prices, features and risks change. Check the official source and do your own research before you spend money
          or move funds.
        </p>
      </Block>
    </GlassPanel>
  );
}

export function DisclosurePage() {
  return (
    <GlassPanel className="mx-auto max-w-3xl p-6 sm:p-8">
      <PageHeading title="Affiliate disclosure" />
      <Block title="How affiliate links work">
        <p>
          Some links on Stackwise are affiliate links. If you click one and later sign up or buy, Stackwise may earn a
          commission. You do not pay extra because of that.
        </p>
      </Block>
      <Block title="What an affiliate link does not mean">
        <p>
          A tool appears on Stackwise because it is relevant to a topic. An affiliate link does not mean we recommend the
          product, and unless a post says otherwise, we have not used it. A commission does not change what we write.
        </p>
      </Block>
      <Block title="How links are marked">
        <p>
          Affiliate links are labelled on the page and are marked as sponsored in the page code, so search engines can
          tell them apart.
        </p>
      </Block>
      <Block title="Not advice">
        <p>
          Everything on Stackwise is information only. It is not financial, investment or legal advice. Do your own
          research before you spend money or connect a wallet.
        </p>
      </Block>
    </GlassPanel>
  );
}

export function PrivacyPage() {
  return (
    <GlassPanel className="mx-auto max-w-3xl p-6 sm:p-8">
      <PageHeading title="Privacy" />
      <Block title="What we collect">
        <p>
          If you subscribe to the newsletter, we store your email address. If you post a comment, we store the name and
          message you enter. Readers do not need an account. Team members who write for Stackwise have accounts that
          store their email address and role.
        </p>
      </Block>
      <Block title="What stays on your device">
        <p>
          Your browser may remember small things, such as that you closed a banner, so it does not show again. This
          stays on your device.
        </p>
      </Block>
      <Block title="Cookies and tracking">
        <p>
          At the time of writing, Stackwise does not use advertising cookies. If that changes, this page will be updated.
          Affiliate links lead to other websites, which have their own privacy policies.
        </p>
      </Block>
      <Block title="Where data is kept">
        <p>
          Stackwise is hosted on Vercel, and its database is provided by Supabase. They process data on our behalf to run
          the site.
        </p>
      </Block>
      <Block title="Contact and safety">
        <p>
          The contact page opens your email app, so a copy of your message is not saved on the site. Never send passwords,
          recovery phrases or private keys to anyone, including us.
        </p>
      </Block>
    </GlassPanel>
  );
}

export function ContactPage() {
  return (
    <GlassPanel className="mx-auto max-w-xl p-6 sm:p-8">
      <PageHeading title="Contact" />
      <div className="mt-4 space-y-3 leading-relaxed text-ink/85">
        {CONTACT_EMAIL ? (
          <p>
            Email <a className="font-semibold text-accent" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        ) : (
          <p>
            Email contact is coming soon. For now, message{" "}
            <a className="font-semibold text-accent" href={X_PROFILE_URL} target="_blank" rel="noopener noreferrer">
              @{OWNER.handle}
            </a>{" "}
            on X.
          </p>
        )}
        <p className="text-sm text-ink/65">Never send passwords, recovery phrases or private keys to anyone, including us.</p>
      </div>
    </GlassPanel>
  );
}

export function ContactPage() {
  return (
    <GlassPanel className="mx-auto max-w-xl p-6 sm:p-8">
      <PageHeading title="Contact" />
      <div className="mt-4 space-y-3 leading-relaxed text-ink/85">
        {CONTACT_EMAIL ? (
          <p>
            Email <a className="font-semibold text-accent" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        ) : (
          <p>
            Email contact is coming soon. For now, message{" "}
            <a className="font-semibold text-accent" href={X_PROFILE_URL} target="_blank" rel="noopener noreferrer">
              @{OWNER.handle}
            </a>{" "}
            on X.
          </p>
        )}
        <p className="text-sm text-ink/65">Never send passwords, recovery phrases or private keys to anyone, including us.</p>
      </div>
    </GlassPanel>
  );
}
