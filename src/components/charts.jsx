export function DonutChart({ data, size = 160, thickness = 22, label, sub }) {
  const total = data.reduce((s, x) => s + x.value, 0);
  const r = size / 2 - thickness / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={thickness}/>
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = c * frac;
          const offset = -c * acc;
          acc += frac;
          return (
            <circle key={i} cx={size/2} cy={size/2} r={r}
                    fill="none" stroke={d.color} strokeWidth={thickness}
                    strokeDasharray={`${dash} ${c - dash}`}
                    strokeDashoffset={offset}
                    strokeLinecap="butt"/>
          );
        })}
      </svg>
      {(label || sub) && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', lineHeight: 1.1 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{sub}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: size < 100 ? 14 : 20, fontWeight: 600, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{label}</div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useRef } from 'react';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

export function LineChart({ values, height = 80, accent = 'var(--accent)', fill = true, labels }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const svgRef = useRef(null);

  const max = Math.max(...values, 1);
  const w = 280;
  const stepX = w / (values.length - 1);
  const pts = values.map((v, i) => [i * stepX, height - (v / max) * (height - 8) - 4]);
  const path = pts.map((p, i) => {
    if (i === 0) return `M${p[0]},${p[1]}`;
    const prev = pts[i - 1];
    const cx = (prev[0] + p[0]) / 2;
    return `C${cx},${prev[1]} ${cx},${p[1]} ${p[0]},${p[1]}`;
  }).join(' ');
  const area = path + ` L${w},${height} L0,${height} Z`;

  const getIdx = (clientX) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const xRatio = (clientX - rect.left) / rect.width;
    return Math.min(values.length - 1, Math.max(0, Math.round(xRatio * (values.length - 1))));
  };

  const handleMove = (e) => {
    if (!labels) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setActiveIdx(getIdx(clientX));
  };
  const handleEnd = () => setActiveIdx(null);

  const ap = activeIdx !== null ? pts[activeIdx] : null;

  return (
    <div style={{ position: 'relative' }}>
      {ap && labels && (
        <div style={{
          position: 'absolute',
          left: `clamp(32px, ${(ap[0] / w * 100).toFixed(1)}%, calc(100% - 32px))`,
          top: Math.max(0, ap[1] - 32) / height * 100 + '%',
          transform: 'translate(-50%, -110%)',
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '5px 10px',
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          color: 'var(--text-1)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
        }}>
          <span style={{ color: 'var(--text-2)', marginRight: 5, fontSize: 10 }}>{labels[activeIdx]}</span>
          {fmt(values[activeIdx])}
        </div>
      )}
      <svg
        ref={svgRef}
        width="100%" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none"
        style={{ display: 'block', cursor: labels ? 'crosshair' : 'default', touchAction: 'none' }}
        onMouseMove={handleMove}
        onMouseLeave={handleEnd}
        onTouchStart={handleMove}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <defs>
          <linearGradient id="lc-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.32"/>
            <stop offset="100%" stopColor={accent} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {fill && <path d={area} fill="url(#lc-fill)"/>}
        <path d={path} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        {ap ? (
          <>
            <line x1={ap[0]} y1={0} x2={ap[0]} y2={height} stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
            <circle cx={ap[0]} cy={ap[1]} r="4" fill={accent} stroke="var(--surface-1)" strokeWidth="2"/>
          </>
        ) : pts.map((p, i) => i === pts.length - 1 && (
          <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={accent} stroke="var(--surface-1)" strokeWidth="2"/>
        ))}
      </svg>
    </div>
  );
}

export function BarsChart({ months, height = 110 }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const svgRef = useRef(null);

  const max = Math.max(...months.flatMap((m) => [m.income, m.spend]));
  const bw = 14, gap = 6, groupW = bw * 2 + gap + 14;
  const w = months.length * groupW;

  const getIdx = (clientX) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const xRatio = (clientX - rect.left) / rect.width;
    const xSvg = xRatio * w;
    return Math.min(months.length - 1, Math.max(0, Math.floor(xSvg / groupW)));
  };
  const handleMove = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setActiveIdx(getIdx(clientX));
  };
  const handleEnd = () => setActiveIdx(null);

  const am = activeIdx !== null ? months[activeIdx] : null;
  const ax = activeIdx !== null ? activeIdx * groupW + bw + gap / 2 : null;

  return (
    <div style={{ position: 'relative' }}>
      {am && (
        <div style={{
          position: 'absolute',
          left: `clamp(48px, ${(ax / w * 100).toFixed(1)}%, calc(100% - 48px))`,
          top: 0,
          transform: 'translate(-50%, 0)',
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '5px 10px',
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          color: 'var(--text-1)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          <span style={{ color: 'var(--text-2)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 }}>{am.m}</span>
          <span style={{ color: 'var(--accent-strong)' }}>↓ {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(am.income)}</span>
          <span style={{ color: 'var(--coral-strong)' }}>↑ {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(am.spend)}</span>
          <span style={{ borderTop: '1px solid var(--border)', paddingTop: 2, marginTop: 1 }}>= {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(am.income - am.spend)}</span>
        </div>
      )}
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${w} ${height + 24}`} preserveAspectRatio="none"
        style={{ display: 'block', cursor: 'crosshair', touchAction: 'none' }}
        onMouseMove={handleMove} onMouseLeave={handleEnd}
        onTouchStart={handleMove} onTouchMove={handleMove} onTouchEnd={handleEnd}
      >
        {months.map((m, i) => {
          const x = i * groupW + 4;
          const ih = (m.income / max) * height;
          const sh = (m.spend / max) * height;
          const active = activeIdx === i;
          return (
            <g key={i}>
              <rect x={x} y={height - ih} width={bw} height={ih} rx={3}
                    fill="var(--accent)" opacity={active ? 1 : 0.75}/>
              <rect x={x + bw + gap} y={height - sh} width={bw} height={sh} rx={3}
                    fill="var(--text-1)" opacity={active ? 0.35 : 0.18}/>
              <text x={x + bw + gap / 2} y={height + 14} textAnchor="middle"
                    fontSize="10" fill={active ? 'var(--text-1)' : 'var(--text-2)'}
                    fontWeight={active ? '700' : '400'}
                    fontFamily="var(--font-mono)">{m.m}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function StackedAreaChart({ investments, months, kindHue }) {
  const W = 300, H = 130;
  const n = months.length;
  const stepX = W / (n - 1);
  const totals = months.map((_, mi) => investments.reduce((s, inv) => s + inv.history[mi], 0));
  const max = Math.max(...totals);

  const stack = investments.map(() => Array(n).fill(0));
  for (let mi = 0; mi < n; mi++) {
    let acc = 0;
    for (let i = 0; i < investments.length; i++) {
      const v = investments[i].history[mi];
      stack[i][mi] = [acc, acc + v];
      acc += v;
    }
  }

  const yScale = (v) => H - (v / max) * (H - 8) - 4;
  const smoothPath = (topPts, botPts) => {
    const pts = [...topPts, ...botPts.reverse()];
    return pts.map((p, i) => i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`).join(' ') + 'Z';
  };

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 18}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        {investments.map((inv, i) => {
          const hue = kindHue[inv.kind] || 175;
          const top = stack[i].map(([_, t], mi) => [mi * stepX, yScale(t)]);
          const bot = stack[i].map(([b], mi) => [mi * stepX, yScale(b)]);
          return (
            <path key={inv.id} d={smoothPath(top, bot)}
                  fill={`oklch(0.72 0.10 ${hue})`} fillOpacity="0.85"
                  stroke={`oklch(0.55 0.13 ${hue})`} strokeWidth="0.5"/>
          );
        })}
        {months.map((m, i) => (
          <text key={i} x={i * stepX} y={H + 14}
                textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
                fontSize="9" fill="var(--text-3)" fontFamily="var(--font-mono)">{m}</text>
        ))}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', marginTop: 10, fontSize: 10 }}>
        {investments.map((inv) => {
          const hue = kindHue[inv.kind] || 175;
          return (
            <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-2)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: `oklch(0.72 0.10 ${hue})`, display: 'inline-block' }}/>
              <span style={{ whiteSpace: 'nowrap' }}>{inv.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
