const roles = [
  {
    title: "Students",
    desc: "Form teams, submit projects, and collaborate with peers across colleges.",
    icon: "🎓",
    color: "oklch(0.57 0.21 278)",
    accent: "oklch(0.57 0.21 278 / 0.10)",
  },
  {
    title: "Colleges",
    desc: "Host hackathons, manage registrations, and showcase your institution.",
    icon: "🏛️",
    color: "oklch(0.60 0.18 220)",
    accent: "oklch(0.60 0.18 220 / 0.10)",
  },
  {
    title: "Companies",
    desc: "Sponsor events, post challenges, and connect with top emerging talent.",
    icon: "🏢",
    color: "oklch(0.62 0.17 155)",
    accent: "oklch(0.62 0.17 155 / 0.10)",
  },
  {
    title: "Volunteers",
    desc: "Support participants, manage logistics, and make hackathons unforgettable.",
    icon: "🤲",
    color: "oklch(0.66 0.18 48)",
    accent: "oklch(0.66 0.18 48 / 0.10)",
  },
];

const Roles = () => {
  return (
    <section id="roles" className="bg-[var(--secondary)] px-6 py-[100px]">
      <div className="mb-4 text-center">
        <span className="badge animate-fade-up">Who It's For</span>
      </div>

      <h2 className="animate-fade-up delay-100 font-display mb-3 text-center text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight text-[var(--foreground)]">
        Built for Everyone
      </h2>

      <p className="animate-fade-up delay-200 font-body mx-auto mb-14 max-w-[480px] text-center text-base leading-relaxed text-[var(--muted-foreground)]">
        One platform serving every role in the hackathon ecosystem — seamlessly.
      </p>

      <div className="mx-auto grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-5">
        {roles.map((role, i) => (
          <div
            key={i}
            className={`card animate-fade-up delay-${(i + 3) * 100} px-7 py-8`}
          >
            <div
              className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] text-2xl"
              style={{
                background: role.accent,
                border: `1px solid ${role.color.replace(")", " / 0.20)")}`,
              }}
            >
              {role.icon}
            </div>

            <h3 className="font-display mb-2.5 text-[1.1rem] font-bold text-[var(--foreground)]">
              {role.title}
            </h3>

            <p className="text-[0.875rem] leading-relaxed text-[var(--muted-foreground)]">
              {role.desc}
            </p>

            <div
              className="mt-6 h-[2px] rounded-full opacity-60"
              style={{ background: `linear-gradient(90deg, ${role.color}, transparent)` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Roles;