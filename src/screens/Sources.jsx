import { Icons } from '../components/Icons';
import { Card, Pill, SectionTitle, ScreenHeader, HeaderIconBtn, ProgressBar } from '../components/ui';
import { LineChart } from '../components/charts';
import { BRL, sources } from '../data/appData';

export function Sources({ onBack }) {
  const total = sources.reduce((s, x) => s + x.monthly, 0);

  return (
    <div className="screen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 16 }}>
        <ScreenHeader
          large title="Origens de renda"
          sub="6 fontes ativas · maio"
          leading={<HeaderIconBtn onClick={onBack}><Icons.back size={18}/></HeaderIconBtn>}
          trailing={<HeaderIconBtn><Icons.plus size={18}/></HeaderIconBtn>}
        />

        {/* Hero */}
        <div style={{ padding: '0 16px' }}>
          <div className="cg-card cg-hero" style={{
            background: 'linear-gradient(150deg, var(--surface-2), color-mix(in oklab, var(--accent) 8%, var(--surface-1)))',
            color: 'var(--text-1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Recebido em maio</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 650, marginTop: 6, letterSpacing: -0.6, fontVariantNumeric: 'tabular-nums' }}>{BRL(total)}</div>
                <Pill tone="good" style={{ marginTop: 10 }}><Icons.arrow_up size={10} stroke={2.4}/> +14% vs abril</Pill>
              </div>
              <div style={{ width: 90 }}>
                <LineChart values={[6200, 6800, 6500, 8300, 8200, 9480]} height={56} fill/>
              </div>
            </div>
          </div>
        </div>

        {/* Ranking */}
        <div style={{ padding: '0 16px' }}>
          <SectionTitle title="Ranking de fontes" action="Comparar"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sources.map((s, i) => {
              const pct = s.monthly / total;
              const hue = (i * 47) % 360;
              return (
                <Card key={s.id} style={{ padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                      background: `oklch(0.92 0.08 ${hue})`, color: `oklch(0.40 0.14 ${hue})`,
                      display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 700,
                    }}>{s.label[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>
                        {s.kind}{s.recurring ? ' · recorrente' : ' · eventual'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600 }}>{BRL(s.monthly)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{Math.round(pct * 100)}%</div>
                    </div>
                  </div>
                  <ProgressBar value={pct * 100} max={100} tone="primary"/>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '0 16px' }}>
          <Card style={{ padding: 14, background: 'transparent', border: '1px dashed var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>+ Criar origem personalizada</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>Ex.: "PIX do pai", "Presente da avó", "Venda no marketplace"</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
