const steps = [
  { title: "Create a Hackathon", desc: "Set up your event in minutes — define tracks, prizes, and timelines.", icon: "🚀" },
  { title: "Join & Form Teams", desc: "Students register, connect with teammates, and get ready to build.", icon: "🤝" },
  { title: "Get Sponsorships", desc: "Match with companies eager to sponsor and discover fresh talent.", icon: "💼" },
  { title: "Submit & Showcase", desc: "Present projects, get judged, and celebrate the best innovations.", icon: "🏆" },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-[var(--background)] px-6 py-[100px]">
      <div className="mb-4 text-center">
        <span className="badge animate-fade-up">How It Works</span>
      </div>

      <h2 className="animate-fade-up delay-100 font-display mb-16 text-center text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight text-[var(--foreground)]">
        From idea to impact —{" "}
        <span className="bg-gradient-to-br from-[oklch(0.55_0.22_278)] to-[oklch(0.62_0.20_220)] bg-clip-text text-transparent">
          four simple steps
        </span>
      </h2>

      <div className="mx-auto grid max-w-[1100px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`card step-connector animate-fade-up delay-${(index + 2) * 100} px-6 py-8 text-center`}
          >
            <div className="font-display shadow-glow mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.55_0.22_278)] to-[oklch(0.48_0.22_278)] text-[1.1rem] font-extrabold text-white">
              {index + 1}
            </div>

            <div className="mb-3 text-[1.6rem]">{step.icon}</div>

            <h3 className="font-display mb-2 text-base font-bold text-[var(--foreground)]">
              {step.title}
            </h3>

            <p className="text-[0.875rem] leading-relaxed text-[var(--muted-foreground)]">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;