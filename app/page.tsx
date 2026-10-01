export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            DevOps CI Demo
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            GitHub Actions CI Dashboard
          </h1>

          <p className="mt-4 text-slate-400">
            A small Next.js application demonstrating Continuous Integration,
            automated testing, and Docker.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatusCard
            title="Source Checkout"
            status="Ready"
          />

          <StatusCard
            title="Dependencies"
            status="Ready"
          />

          <StatusCard
            title="Automated Tests"
            status="Ready"
          />

          <StatusCard
            title="Production Build"
            status="Ready"
          />

          <StatusCard
            title="Docker"
            status="Ready"
          />

          <StatusCard
            title="CI Pipeline"
            status="Ready"
          />
        </section>

        <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Application Health</h2>

          <p className="mt-2 text-slate-400">
            Check the application health using:
          </p>

          <code className="mt-3 block rounded bg-slate-950 p-3 text-cyan-400">
            GET /api/health
          </code>
        </div>
      </div>
    </main>
  );
}

function StatusCard({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <div className="mt-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

        <span className="font-medium text-green-400">{status}</span>
      </div>
    </div>
  );
}
