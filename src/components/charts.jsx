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

export function LineChart({ values, height = 80, accent = 'var(--accent)', fill = true }) {
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
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="lc-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.32"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {fill && <path d={area} fill="url(#lc-fill)"/>}
      <path d={path} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map((p, i) => i === pts.length - 1 && (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={accent} stroke="var(--surface-1)" strokeWidth="2"/>
      ))}
    </svg>
  );
}

export function BarsChart({ months, height = 110 }) {
  const max = Math.max(...months.flatMap((m) => [m.income, m.spend]));
  const bw = 14, gap = 6;
  const w = months.length * (bw * 2 + gap + 14);
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height + 24}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {months.map((m, i) => {
        const x = i * (bw * 2 + gap + 14) + 4;
        const ih = (m.income / max) * height;
        const sh = (m.spend / max) * height;
        return (
          <g key={i}>
            <rect x={x} y={height - ih} width={bw} height={ih} rx={3} fill="var(--accent)" opacity="0.85"/>
            <rect x={x + bw + gap} y={height - sh} width={bw} height={sh} rx={3} fill="var(--text-1)" opacity="0.18"/>
            <text x={x + bw + gap/2} y={height + 14} textAnchor="middle"
                  fontSize="10" fill="var(--text-2)" fontFamily="var(--font-mono)">{m.m}</text>
          </g>
        );
      })}
    </svg>
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
