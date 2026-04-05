import Link from "next/link";

const Hero = () => {
  return (
    <section className="mesh-bg flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-20">
      <div className="w-full max-w-[760px] text-center">

        {/* Badge */}
        <div className="animate-fade-up mb-7">
          <span className="badge inline-flex text-[var(--foreground)] items-center gap-1">
            <span className="text-[0.65rem]">⚡</span>
            Hackathon Management Platform
          </span>
        </div>

        {/* Heading */}
        <h1 className="animate-fade-up delay-100 font-display mb-5 text-[clamp(2.6rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-tight text-[var(--foreground)]">
          One Platform.{" "}
          <br />
          <span className="bg-gradient-to-br from-[oklch(0.55_0.22_278)] to-[oklch(0.62_0.20_220)] bg-clip-text text-transparent">
            Every Hackathon.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up delay-200 font-body mx-auto mb-10 max-w-[540px] text-[1.125rem] leading-relaxed text-[var(--muted-foreground)]">
          Organize, participate, and sponsor hackathons — all in one powerful,
          role-based platform built for colleges, students, and companies.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-up delay-300 flex flex-wrap justify-center gap-3">
          <Link href="/register">
            <button className="btn-primary flex items-center gap-2">
              Host a Hackathon
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Link>

          <Link href="/register?role=student">
            <button className="btn-ghost">Join as Student</button>
          </Link>

          <Link href="/register?role=sponsor">
            <button className="btn-ghost">Sponsor Innovation</button>
          </Link>
        </div>

        {/* Social proof */}
        <div className="animate-fade-up delay-500 mt-14 flex flex-wrap justify-center gap-8">
          {[
            { value: "2,400+", label: "Hackathons Hosted" },
            { value: "48K+",   label: "Participants" },
            { value: "360+",   label: "Partner Companies" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl font-bold tracking-tight text-[var(--foreground)]">
                {stat.value}
              </div>
              <div className="mt-0.5 text-[0.8rem] text-[var(--muted-foreground)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;