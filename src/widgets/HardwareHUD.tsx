'use client';

import { useWidgetSDK } from '@nitrostack/widgets';

interface HUDData {
  subsystem: string;
  target: string;
  output: string;
  success: boolean;
}

function TelemetryState({ children, tone }: { children: string; tone: 'cyan' | 'rose' }) {
  const styles = tone === 'cyan'
    ? 'border-cyan-400/30 text-cyan-200 shadow-[0_0_35px_rgba(34,211,238,0.14)]'
    : 'border-rose-400/35 text-rose-200 shadow-[0_0_35px_rgba(251,113,133,0.16)]';

  return (
    <div className={`rounded-2xl border bg-slate-950/80 p-8 font-mono text-sm backdrop-blur-2xl ${styles}`}>
      <p className="animate-pulse tracking-[0.18em]">{children}</p>
    </div>
  );
}

export default function HardwareHUD() {
  const { isReady, getToolOutput } = useWidgetSDK();
  const data = getToolOutput<HUDData>();

  if (!isReady) {
    return <TelemetryState tone="cyan">ESTABLISHING SECURE TELEMETRY LINK…</TelemetryState>;
  }

  if (!data) {
    return <TelemetryState tone="rose">NO INCIDENT TELEMETRY RECEIVED</TelemetryState>;
  }

  const statusClasses = data.success
    ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.18)]'
    : 'border-rose-400/35 bg-rose-400/10 text-rose-200 shadow-[0_0_20px_rgba(251,113,133,0.18)]';

  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-cyan-400/30 bg-slate-950/80 p-1 shadow-[0_0_50px_rgba(34,211,238,0.16)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[length:100%_4px]" />
      <div className="relative rounded-[0.9rem] border border-white/5 bg-slate-950/75 p-5 text-slate-100 backdrop-blur-2xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-400/20 pb-4">
          <div>
            <p className="mb-1 font-mono text-xs tracking-[0.22em] text-cyan-300/75">EDGE SENTINEL // INCIDENT COMMAND</p>
            <h1 className="font-mono text-xl font-semibold uppercase tracking-wider text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">
              {data.subsystem} <span className="text-cyan-400">/</span> {data.target}
            </h1>
          </div>
          <span className={`rounded-full border px-3 py-1 font-mono text-xs font-semibold tracking-widest ${statusClasses}`}>
            {data.success ? 'SYSTEM NOMINAL' : 'ACTION FAILED'}
          </span>
        </header>

        <div className="overflow-hidden rounded-xl border border-slate-700/80 bg-black/70 shadow-inner shadow-black/80">
          <div className="flex items-center gap-2 border-b border-slate-700/80 bg-slate-900/80 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="ml-2 font-mono text-xs tracking-wider text-slate-400">root@edge-sentinel:~# telemetry-stream</span>
          </div>
          <pre className="max-h-80 overflow-auto p-4 font-mono text-sm leading-6 text-cyan-100 whitespace-pre-wrap break-words [text-shadow:0_0_8px_rgba(34,211,238,0.32)]">
            <code>{data.output || '[NO STDOUT GENERATED]'}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
