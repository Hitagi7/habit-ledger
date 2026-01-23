import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">HL</span>
              </div>
              <span className="font-semibold text-lg">Habit Ledger</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="btn-primary text-sm font-medium text-white px-4 py-2 rounded-full"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 glow-orange rounded-full blur-3xl -z-10 animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 glow-cyan rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/20 text-green-300 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Track Money. Build Habits. Get Insights.
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Your finances and habits,{" "}
              <span className="text-orange-400">all in one place</span>
            </h1>
            <p className="text-lg sm:text-xl text-foreground/60 mb-8 max-w-2xl mx-auto">
              Habit Ledger helps you track expenses, manage budgets, and build
              lasting habits. Get AI-powered insights about your spending
              patterns and habit streaks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="btn-tertiary inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-full text-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
                Start Tracking Free
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-full text-lg border border-foreground/20 hover:bg-foreground/5 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero illustration placeholder */}
          <div className="mt-16 relative">
            <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mini stat cards */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-foreground/60">
                      Monthly Savings
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-500">+$1,240</p>
                  <p className="text-sm text-foreground/50 mt-1">
                    ↑ 12% from last month
                  </p>
                </div>

                <div className="bg-zinc-900 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-900/50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-amber-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-foreground/60">
                      Workout Streak
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">14 days</p>
                  <p className="text-sm text-foreground/50 mt-1">
                    🔥 Personal best!
                  </p>
                </div>

                <div className="bg-zinc-900 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-cyan-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-foreground/60">
                      Budget Used
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-cyan-600">68%</p>
                  <p className="text-sm text-foreground/50 mt-1">
                    $680 of $1,000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{" "}
              <span className="gradient-text">take control</span>
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Track your finances and habits in one unified dashboard. Get
              smart insights powered by AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="feature-card bg-zinc-900 rounded-2xl p-8 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Transaction Tracking
              </h3>
              <p className="text-foreground/60">
                Log expenses with categories, tags, and filters. See where your
                money goes with detailed breakdowns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card bg-zinc-900 rounded-2xl p-8 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Budgets</h3>
              <p className="text-foreground/60">
                Set monthly or weekly limits per category. Get alerts before
                you overspend.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-foreground/5">
              <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Habit Streaks</h3>
              <p className="text-foreground/60">
                Build lasting habits with streak tracking, completion rates,
                and progress visualization.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-foreground/5">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Analytics Dashboard
              </h3>
              <p className="text-foreground/60">
                Visualize spending trends, category breakdowns, savings, and
                habit consistency over time.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-foreground/5">
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Insights</h3>
              <p className="text-foreground/60">
                Get weekly summaries and smart suggestions powered by Google
                Gemini AI.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-foreground/5">
              <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Reminders</h3>
              <p className="text-foreground/60">
                Never miss a habit or bill. Get notifications and email
                summaries on your schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-12 text-center text-white relative overflow-hidden"
            style={{ background: "var(--gradient-primary)" }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to take control of your finances and habits?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are building better financial
                habits. It&apos;s free to get started.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-8 py-4 rounded-full text-lg hover:bg-white/90 transition-colors"
              >
                Get Started Free
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-foreground/50">
              © 2026 <a href="https://github.com/Hitagi7" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-white transition-colors">Hitagi7</a>. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/Hitagi7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
