import { useState } from 'react';
import { Icons } from '../components/Icons';
import { Card, Pill, SectionTitle, ScreenHeader, HeaderIconBtn } from '../components/ui';
import { DonutChart, BarsChart, LineChart } from '../components/charts';
import { BRL, BRLshort, categories, sources, spending, months, dailySpend, totalIncome, totalSpend, insights } from '../data/appData';

export function Reports({ onBack }) {
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
                {tab === 'mensal' ? <BarsChart months={months} height={120}/> : <LineChart values={dailySpend} height={120}/>}
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

        {/* Insights */}
        <div style={{ padding: '0 16px' }}>
          <SectionTitle title="Insights automáticos"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {insights.slice(0, 3).map((ins, i) => (
              <Card key={i} style={{ padding: 14, display: 'flex', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: ins.tone === 'warn' ? 'color-mix(in oklab, var(--amber) 18%, transparent)'
                            : ins.tone === 'good' ? 'color-mix(in oklab, var(--accent) 18%, transparent)'
                            : 'var(--surface-2)',
                  color: ins.tone === 'warn' ? 'var(--amber-strong)'
                       : ins.tone === 'good' ? 'var(--accent-strong)'
                       : 'var(--text-2)',
                  display: 'grid', placeItems: 'center',
                }}>
                  {ins.tone === 'warn' ? <Icons.alert size={16}/> : ins.tone === 'good' ? <Icons.spark size={16}/> : <Icons.chart size={16}/>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{ins.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2, lineHeight: 1.45 }}>{ins.body}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
