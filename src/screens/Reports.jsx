import { useState } from 'react';
import { Icons } from '../components/Icons';
import { Card, Pill, CategoryIcon, SectionTitle, ScreenHeader, HeaderIconBtn } from '../components/ui';
import { DonutChart, BarsChart, LineChart } from '../components/charts';
import {
  BRL, BRLshort,
  categories, sources, spending, months, dailySpend,
  totalIncome, totalSpend, categoryMonthly,
} from '../data/appData';

const MONTH_LABELS = months.map((m) => m.m);
const MONTH_KEYS   = ['2025-06','2025-07','2025-08','2025-09','2025-10','2025-11','2025-12','2026-01','2026-02','2026-03','2026-04','2026-05'];

function CategoryEvolution({ onNavigate }) {
  const [cat, setCat] = useState('alim');

  const data    = categoryMonthly[cat] ?? [];
  const current = data[data.length - 1] ?? 0;
  const prev    = data[data.length - 2] ?? 0;
  const avg     = Math.round(data.reduce((s, v) => s + v, 0) / data.length);
  const maxVal  = Math.max(...data);
  const maxIdx  = data.indexOf(maxVal);
  const diff    = current - prev;
  const catMeta = categories.find((c) => c.id === cat);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Category selector */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px',
            flexShrink: 0,
          }}>
            <div style={{
              padding: 3, borderRadius: 14,
              background: cat === c.id ? 'var(--accent)' : 'transparent',
              transition: 'background .15s',
            }}>
              <CategoryIcon cat={c.id} size={36}/>
            </div>
            <div style={{
              fontSize: 9, fontWeight: cat === c.id ? 650 : 500,
              color: cat === c.id ? 'var(--text-1)' : 'var(--text-2)',
              whiteSpace: 'nowrap',
            }}>{c.label}</div>
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { label: 'Maio', value: BRL(current), sub: diff !== 0 ? (diff > 0 ? '▲ ' : '▼ ') + BRLshort(Math.abs(diff)) + ' vs abr' : '= igual a abr', subColor: diff > 0 ? 'var(--coral-strong)' : diff < 0 ? 'var(--accent-strong)' : 'var(--text-3)' },
          { label: 'Média',  value: BRLshort(avg), sub: '12 meses', subColor: 'var(--text-3)' },
          { label: 'Maior',  value: BRLshort(maxVal), sub: MONTH_LABELS[maxIdx], subColor: 'var(--text-3)' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: s.subColor, marginTop: 3, fontWeight: 600 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Line chart */}
      <div>
        <LineChart
          values={data}
          height={100}
          labels={MONTH_LABELS}
          accent={`oklch(0.62 0.14 ${catMeta?.hue ?? 200})`}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-3)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          <span>{MONTH_LABELS[0]}</span><span>{MONTH_LABELS[MONTH_LABELS.length - 1]}</span>
        </div>
      </div>

      {/* Monthly list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {data.map((v, i) => {
          const barPct = maxVal > 0 ? v / maxVal * 100 : 0;
          const isLast = i === data.length - 1;
          const catColor = `oklch(0.62 0.14 ${catMeta?.hue ?? 200})`;
          return (
            <button key={i} onClick={() => onNavigate?.('transactions', { catFilter: cat, monthFilter: MONTH_KEYS[i] })} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0', width: '100%',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: isLast ? 'none' : '1px solid var(--border)',
              textAlign: 'left',
            }}>
              <div style={{ width: 28, fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{MONTH_LABELS[i]}</div>
              <div style={{ flex: 1, height: 6, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  width: barPct + '%', height: '100%', borderRadius: 999,
                  background: isLast ? catColor : `color-mix(in oklab, ${catColor} 50%, var(--surface-3))`,
                  transition: 'width .3s',
                }}/>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: isLast ? 700 : 500, color: isLast ? 'var(--text-1)' : 'var(--text-2)', width: 72, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {BRL(v)}
              </div>
              <Icons.arrow_dn size={10} style={{ transform: 'rotate(-90deg)', flexShrink: 0, color: 'var(--text-3)' }}/>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Reports({ onBack, onNavigate }) {
  const [tab, setTab] = useState('categorias');

  return (
    <div className="screen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 16 }}>
        <ScreenHeader
          large title="Relatórios"
          sub="Maio · comparado a abril"
          leading={<HeaderIconBtn onClick={onBack}><Icons.back size={18}/></HeaderIconBtn>}
          trailing={<HeaderIconBtn><Icons.upload size={18}/></HeaderIconBtn>}
        />

        {/* Tab pills */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {[
              { id: 'categorias', l: 'Categorias' },
              { id: 'origens',    l: 'Origens'    },
              { id: 'mensal',     l: 'Mensal'     },
              { id: 'evolucao',   l: 'Evolução'   },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '8px 14px', borderRadius: 999,
                border: '1px solid ' + (tab === t.id ? 'var(--text-1)' : 'var(--border)'),
                background: tab === t.id ? 'var(--text-1)' : 'transparent',
                color: tab === t.id ? 'var(--surface-1)' : 'var(--text-2)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>{t.l}</button>
            ))}
          </div>
        </div>

        {/* Chart card */}
        <div style={{ padding: '0 16px' }}>
          <Card style={{ padding: 18 }}>
            {(tab === 'mensal' || tab === 'evolucao') ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
                      {tab === 'mensal' ? 'Receita vs despesa' : 'Gastos diários — maio'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, marginTop: 4 }}>{BRL(totalSpend)}</div>
                  </div>
                  <Pill tone="good"><Icons.arrow_dn size={10} stroke={2.4}/> 9% melhor</Pill>
                </div>
                {tab === 'mensal'
                  ? <BarsChart months={months} height={120}/>
                  : <LineChart values={dailySpend} height={120} labels={dailySpend.map((_, i) => `${i + 1} mai`)}/>
                }
                {tab === 'mensal' && (
                  <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 11, color: 'var(--text-2)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent)', display: 'inline-block' }}/> Receita
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: 'color-mix(in oklab, var(--text-1) 18%, transparent)', display: 'inline-block' }}/> Despesa
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
                      {tab === 'categorias' ? 'Gastos por categoria' : 'Receitas por origem'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, marginTop: 4 }}>
                      {BRL(tab === 'categorias' ? totalSpend : totalIncome)}
                    </div>
                  </div>
                  <Pill tone={tab === 'categorias' ? 'danger' : 'good'}>
                    {tab === 'categorias' ? '+5% vs abril' : '+14% vs abril'}
                  </Pill>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <DonutChart
                    size={130} thickness={20}
                    data={(tab === 'categorias' ? spending : sources).map((x, i) => {
                      if (tab === 'categorias') {
                        const c = categories.find((y) => y.id === x.cat);
                        return { value: x.value, color: `oklch(0.62 0.14 ${c.hue})` };
                      }
                      return { value: x.monthly, color: `oklch(0.62 0.14 ${(i * 47) % 360})` };
                    })}
                    sub={tab === 'categorias' ? '9 categorias' : '6 origens'}
                    label={BRLshort(tab === 'categorias' ? totalSpend : totalIncome)}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(tab === 'categorias' ? spending.slice(0, 5) : sources.slice(0, 5)).map((x, i) => {
                      const meta = tab === 'categorias'
                        ? { lbl: categories.find((c) => c.id === x.cat).label, val: x.value, color: `oklch(0.62 0.14 ${categories.find((c) => c.id === x.cat).hue})` }
                        : { lbl: x.label, val: x.monthly, color: `oklch(0.62 0.14 ${(i * 47) % 360})` };
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 4, background: meta.color, flexShrink: 0 }}/>
                          <div style={{ flex: 1, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta.lbl}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)' }}>{BRLshort(meta.val)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Category evolution section */}
        <div style={{ padding: '0 16px' }}>
          <SectionTitle title="Evolução por categoria"/>
          <Card style={{ padding: 16 }}>
            <CategoryEvolution onNavigate={onNavigate}/>
          </Card>
        </div>
      </div>
    </div>
  );
}
