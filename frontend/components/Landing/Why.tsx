const pairs = [
  { problem: "Scattered Processes", solution: "All-in-One Platform", problemIcon: "📂", solutionIcon: "🎯" },
  { problem: "Team Coordination Issues", solution: "Easy Team & Submission Management", problemIcon: "😵", solutionIcon: "✅" },
  { problem: "Sponsorship Challenges", solution: "Sponsorship Matching", problemIcon: "🔍", solutionIcon: "🤝" },
  { problem: "No Central Hub", solution: "Real-Time Collaboration", problemIcon: "❌", solutionIcon: "⚡" },
];

function Why() {
  return (
    <section id="features" className="bg-[var(--background)] px-6 py-[100px]">
      <div className="mb-4 text-center">
        <span className="badge animate-fade-up">Why Choose Us</span>
      </div>

      <h2 className="animate-fade-up delay-100 font-display mb-3 text-center text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight text-[var(--foreground)]">
        The Problem vs The Solution
      </h2>

      <p className="animate-fade-up delay-200 font-body mx-auto mb-14 max-w-[460px] text-center text-base leading-relaxed text-[var(--muted-foreground)]">
        We built exactly what hackathon organizers and participants were missing.
      </p>

      <div className="mx-auto max-w-[860px]">
        {/* Column headers */}
        <div className="animate-fade-up delay-200 mb-3 grid grid-cols-[1fr_48px_1fr] gap-3 px-1">
          <div className="rounded-t-[var(--radius-md)] border border-[oklch(0.60_0.20_25/0.20)] bg-[oklch(0.60_0.20_25/0.08)] py-3.5 text-center">
            <span className="font-display text-[0.85rem] font-bold uppercase tracking-widest text-[oklch(0.55_0.18_25)]">
              😤 The Problem
            </span>
          </div>
          <div />
          <div className="rounded-t-[var(--radius-md)] border border-[oklch(0.55_0.18_155/0.20)] bg-[oklch(0.55_0.18_155/0.08)] py-3.5 text-center">
            <span className="font-display text-[0.85rem] font-bold uppercase tracking-widest text-[oklch(0.50_0.16_155)]">
              ✅ Our Solution
            </span>
          </div>
        </div>

        {/* Rows */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] shadow-md overflow-hidden">
          {pairs.map((pair, i) => (
            <div key={i} className={`animate-fade-up delay-${(i + 3) * 100} grid grid-cols-[1fr_48px_1fr] items-center`}>
              {/* Problem cell */}
              <div className="flex items-center gap-3 px-6 py-5">
                <span className="shrink-0 text-[1.2rem]">{pair.problemIcon}</span>
                <span className="text-[0.9rem] leading-tight text-[var(--muted-foreground)]">{pair.problem}</span>
              </div>

              {/* VS divider */}
              <div className="flex h-full items-center justify-center border-x border-[var(--border)] bg-[var(--secondary)]">
                <span className="text-[0.65rem] font-bold tracking-widest text-[var(--muted-foreground)] [writing-mode:vertical-rl]">VS</span>
              </div>

              {/* Solution cell */}
              <div className="flex items-center gap-3 bg-[oklch(0.55_0.18_155/0.04)] px-6 py-5">
                <span className="shrink-0 text-[1.2rem]">{pair.solutionIcon}</span>
                <span className="text-[0.9rem] font-medium leading-tight text-[var(--foreground)]">{pair.solution}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Why;