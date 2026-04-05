import Link from "next/link";

const CTA = () => {
  return (
    <section className="bg-[var(--secondary)] px-6 py-[100px]">
      <div className="animate-fade-up shadow-glow relative mx-auto max-w-[720px] overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-[oklch(0.55_0.22_278)] to-[oklch(0.52_0.19_260)] px-12 py-16 text-center shadow-lg">

        {/* Background decorations */}
        <div aria-hidden className="pointer-events-none absolute -right-[60px] -top-[60px] h-[240px] w-[240px] rounded-full bg-[oklch(1_0_0/0.06)]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-[80px] -left-[40px] h-[200px] w-[200px] rounded-full bg-[oklch(1_0_0/0.04)]" />

        {/* Badge */}
        <div className="mb-5">
          <span className="font-body inline-flex items-center gap-1.5 rounded-full border border-[oklch(1_0_0/0.25)] bg-[oklch(1_0_0/0.15)] px-3.5 py-1.5 text-[0.72rem] font-bold uppercase tracking-widest text-white">
            🚀 Get Started Today
          </span>
        </div>

        <h2 className="font-display mb-4 text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold leading-[1.1] tracking-tight text-white">
          Ready to Run Your
          <br />
          Next Hackathon?
        </h2>

        <p className="font-body mx-auto mb-10 max-w-[420px] text-[1.05rem] leading-relaxed text-[oklch(1_0_0/0.80)]">
          Join thousands of innovators already building the future together on our platform.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/register">
            <button className="font-body group flex items-center gap-2 rounded-[var(--radius-md)] bg-white px-8 py-3.5 text-[0.95rem] font-bold text-[oklch(0.48_0.22_278)] shadow-[0_4px_16px_oklch(0_0_0/0.15)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_oklch(0_0_0/0.20)]">
              Register Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Link>

          <Link href="/login">
            <button className="font-body rounded-[var(--radius-md)] border border-[oklch(1_0_0/0.30)] bg-[oklch(1_0_0/0.12)] px-7 py-[13px] text-[0.95rem] font-medium text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-[oklch(1_0_0/0.20)]">
              Sign In
            </button>
          </Link>
        </div>

        {/* Trust note */}
        <p className="font-body mt-6 text-[0.8rem] text-[oklch(1_0_0/0.55)]">
          Free to start · No credit card required
        </p>
      </div>
    </section>
  );
};

export default CTA;