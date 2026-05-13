import { categories } from '../data/appData';
import { BRL } from '../data/appData';

export function Card({ children, style, onClick, className }) {
  return (
    <div className={'cg-card ' + (className || '')} onClick={onClick} style={style}>
      {children}
    </div>
  );
}

export function Pill({ children, tone = 'neutral', style }) {
  const map = {
    neutral: { bg: 'var(--surface-2)',                                        fg: 'var(--text-2)'      },
    primary: { bg: 'color-mix(in oklab, var(--accent) 18%, transparent)',     fg: 'var(--accent-strong)' },
    amber:   { bg: 'color-mix(in oklab, var(--amber) 18%, transparent)',      fg: 'var(--amber-strong)'  },
    coral:   { bg: 'color-mix(in oklab, var(--coral) 18%, transparent)',      fg: 'var(--coral-strong)'  },
    danger:  { bg: 'color-mix(in oklab, var(--coral) 24%, transparent)',      fg: 'var(--coral-strong)'  },
    good:    { bg: 'color-mix(in oklab, var(--accent) 18%, transparent)',     fg: 'var(--accent-strong)' },
  };
  const s = map[tone] || map.neutral;
  return (
    <span style={{
      background: s.bg, color: s.fg,
      padding: '4px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, lineHeight: 1, letterSpacing: 0.1,
      display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
}

export function Money({ value, size = 24, weight = 600, signed = false, style }) {
  const sign = signed && value > 0 ? '+' : '';
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: size, fontWeight: weight, letterSpacing: -0.4,
      fontVariantNumeric: 'tabular-nums',
      ...style,
    }}>{sign}{BRL(value)}</span>
  );
}

export function CategoryIcon({ cat, size = 36 }) {
  const c = categories.find((x) => x.id === cat) || categories[0];
  const bg = `oklch(0.92 0.08 ${c.hue})`;
  const fg = `oklch(0.40 0.14 ${c.hue})`;
  const glyphs = {
    alim:    <path d="M8 9c0-2 2-4 4-4s4 2 4 4M6 11h12l-1 6H7zM9 5v2M15 5v2"/>,
    trans:   <path d="M6 16h12M7 12h10l-1-4H8zM8 19v-2M16 19v-2"/>,
    assin:   <circle cx="12" cy="12" r="6"/>,
    lazer:   <path d="m12 4 2.5 5 5.5.8-4 4 1 5.5-5-2.6L7 19.3l1-5.5-4-4 5.5-.8z"/>,
    saude:   <path d="M12 6v12M6 12h12" strokeWidth={2.2}/>,
    edu:     <path d="m4 9 8-4 8 4-8 4zM8 11v5c2 1.5 6 1.5 8 0v-5"/>,
    compras: <path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>,
    moradia: <path d="M4 11 12 5l8 6v8H4zM10 19v-5h4v5"/>,
    outros:  <circle cx="12" cy="12" r="2.5"/>,
  };
  const glyph = glyphs[cat] || <circle cx="12" cy="12" r="3"/>;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.32,
      background: `linear-gradient(140deg, ${bg}, color-mix(in oklab, ${bg} 70%, transparent))`,
      color: fg, display: 'grid', placeItems: 'center', flexShrink: 0,
      boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.04)',
    }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24"
           fill="none" stroke="currentColor" strokeWidth="1.7"
           strokeLinecap="round" strokeLinejoin="round">{glyph}</svg>
    </div>
  );
}

export function ProgressBar({ value, max = 100, height = 6, tone = 'primary' }) {
  const pct = Math.min(value / max, 1.25) * 100;
  const colorMap = { primary: 'var(--accent)', amber: 'var(--amber)', coral: 'var(--coral)' };
  const over = value > max;
  return (
    <div style={{ position: 'relative', height, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{
        width: pct + '%', height: '100%',
        background: over ? 'var(--coral)' : colorMap[tone] || colorMap.primary,
        borderRadius: 999, transition: 'width .3s',
      }}/>
    </div>
  );
}

export function SectionTitle({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 4px 10px' }}>
      <h3 style={{ fontSize: 14, fontWeight: 650, letterSpacing: -0.1, margin: 0 }}>{title}</h3>
      {action && (
        <button onClick={onAction} style={{ background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
          {action}
        </button>
      )}
    </div>
  );
}

export function ScreenHeader({ title, sub, leading, trailing, large }) {
  return (
    <div style={{ padding: '8px 20px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{leading}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{trailing}</div>
      </div>
      {large && <div style={{ fontSize: 28, fontWeight: 650, letterSpacing: -0.6, marginTop: 4 }}>{title}</div>}
      {!large && title && <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3 }}>{title}</div>}
      {sub && <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{sub}</div>}
    </div>
  );
}

export function HeaderIconBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 12,
      background: 'var(--surface-2)', border: 'none',
      color: 'var(--text-1)', display: 'grid', placeItems: 'center',
      cursor: 'pointer',
    }}>{children}</button>
  );
}

export function Avatar() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 12,
      background: 'linear-gradient(140deg, var(--accent), color-mix(in oklab, var(--accent) 60%, var(--amber)))',
      color: '#fff', display: 'grid', placeItems: 'center',
      fontWeight: 700, fontSize: 14, letterSpacing: 0.5,
    }}>RM</div>
  );
}

export function FieldRow({ icon, label, value, muted, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderBottom: last ? 'none' : '1px solid var(--border)',
    }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--surface-2)', color: 'var(--text-2)', display: 'grid', placeItems: 'center' }}>{icon}</div>
      <div style={{ flex: 1, fontSize: 13, color: 'var(--text-2)' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: muted ? 'var(--accent-strong)' : 'var(--text-1)' }}>{value}</div>
    </div>
  );
}
