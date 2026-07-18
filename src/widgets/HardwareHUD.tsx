'use client';

import { useWidgetSDK } from '@nitrostack/widgets';

interface Observation {
  code: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  evidence?: Record<string, string | number | boolean>;
}

interface HUDData {
  status: 'healthy' | 'degraded' | 'unavailable' | 'error';
  summary: string;
  capabilities: Record<string, boolean>;
  observations: Observation[];
  remediation: string[];
  execution: { mode: 'host' | 'simulation'; strategy: string; elapsed_ms: number };
  error?: string;
}

const statusStyles = {
  healthy: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-200',
  degraded: 'border-amber-300/35 bg-amber-300/10 text-amber-100',
  unavailable: 'border-slate-400/35 bg-slate-400/10 text-slate-200',
  error: 'border-rose-400/35 bg-rose-400/10 text-rose-200',
};

function TelemetryState({ children, tone }: { children: string; tone: 'cyan' | 'rose' }) {
  return <div className={`rounded-2xl border bg-slate-950/80 p-8 font-mono text-sm backdrop-blur-2xl ${tone === 'cyan' ? 'border-cyan-400/30 text-cyan-200' : 'border-rose-400/35 text-rose-200'}`}>{children}</div>;
}

export default function HardwareHUD() {
  const { isReady, getToolOutput } = useWidgetSDK();
  const data = getToolOutput<HUDData>();
  if (!isReady) return <TelemetryState tone="cyan">ESTABLISHING SECURE TELEMETRY LINK…</TelemetryState>;
  if (!data) return <TelemetryState tone="rose">NO INCIDENT TELEMETRY RECEIVED</TelemetryState>;

  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-cyan-400/30 bg-slate-950/80 p-1 shadow-[0_0_50px_rgba(34,211,238,0.16)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[length:100%_4px]" />
      <div className="relative rounded-[0.9rem] border border-white/5 bg-slate-950/75 p-5 text-slate-100">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-400/20 pb-4">
          <div><p className="mb-1 font-mono text-xs tracking-[0.22em] text-cyan-300/75">EDGE SENTINEL // CAPABILITY-AWARE DIAGNOSTICS</p><h1 className="font-mono text-xl font-semibold uppercase tracking-wider text-cyan-100">{data.summary}</h1></div>
          <span className={`rounded-full border px-3 py-1 font-mono text-xs font-semibold tracking-widest ${statusStyles[data.status]}`}>{data.status.toUpperCase()}</span>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Panel title="OBSERVATIONS">
            {data.observations.map((item) => <div key={`${item.code}-${item.message}`} className="mb-3 border-l-2 border-cyan-400/40 pl-3"><p className="font-mono text-xs text-cyan-300">{item.code} · {item.severity}</p><p className="text-sm text-slate-200">{item.message}</p>{item.evidence && <p className="mt-1 font-mono text-xs text-slate-400">{Object.entries(item.evidence).map(([key, value]) => `${key}: ${value}`).join(' · ')}</p>}</div>)}
          </Panel>
          <Panel title="CAPABILITIES">
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">{Object.entries(data.capabilities).map(([name, available]) => <span key={name} className={available ? 'text-emerald-300' : 'text-slate-500'}>{available ? '●' : '○'} {name}</span>)}</div>
          </Panel>
        </div>
        <Panel title="RECOMMENDED NEXT ACTION" className="mt-4">
          {data.remediation.length ? <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-200">{data.remediation.map((step) => <li key={step}>{step}</li>)}</ol> : <p className="text-sm text-emerald-200">No action is currently recommended.</p>}
        </Panel>
        <p className="mt-4 font-mono text-xs text-slate-500">{data.execution.mode} · {data.execution.strategy} · {data.execution.elapsed_ms}ms{data.error ? ` · ${data.error}` : ''}</p>
      </div>
    </section>
  );
}

function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-700/80 bg-black/50 p-4 ${className}`}><h2 className="mb-3 font-mono text-xs tracking-widest text-cyan-300">{title}</h2>{children}</section>;
}
