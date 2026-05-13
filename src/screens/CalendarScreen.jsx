import { Icons } from '../components/Icons';
import { Card, Pill, CategoryIcon, SectionTitle, ScreenHeader, HeaderIconBtn } from '../components/ui';
import { BRL, categories, recurring } from '../data/appData';

export function CalendarScreen({ onBack }) {
  const daysInMonth = 31;
  const firstWeekday = 5; // maio 2026 começa numa sexta (col 4, 0-indexed Mon)
  const cells = [];
  for (let i = 0; i < firstWeekday - 1; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const bills = recurring.reduce((m, r) => ({ ...m, [r.day]: r }), {});

  return (
    <div className="screen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 16 }}>
        <ScreenHeader
          large title="Calendário"
          sub="Vencimentos · recorrências · pagamentos"
          leading={<HeaderIconBtn onClick={onBack}><Icons.back size={18}/></HeaderIconBtn>}
          trailing={<HeaderIconBtn><Icons.plus size={18}/></HeaderIconBtn>}
        />

        {/* Calendar */}
        <div style={{ padding: '0 16px' }}>
          <Card style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer' }}><Icons.back size={16}/></button>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Maio 2026</div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer' }}><Icons.arrow_r size={16}/></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
              {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((w, i) => (
                <div key={i} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-3)', fontWeight: 600 }}>{w}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {cells.map((d, i) => {
                if (d === null) return <div key={i}/>;
                const isToday = d === 13;
                const bill = bills[d];
                return (
                  <div key={i} style={{
                    aspectRatio: '1', borderRadius: 10,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: isToday ? 'var(--accent)' : 'transparent',
                    color: isToday ? '#fff' : 'var(--text-1)',
                    fontSize: 13, fontWeight: isToday ? 700 : 500, position: 'relative',
                  }}>
                    <span>{d}</span>
                    {bill && !isToday && (
                      <div style={{
                        position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 4,
                        background: bill.cat === 'moradia' ? 'var(--coral)' : bill.cat === 'assin' ? 'var(--amber)' : 'var(--accent)',
                      }}/>
                    )}
                    {bill && isToday && <div style={{ position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 4, background: '#fff' }}/>}
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 10, color: 'var(--text-2)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--coral)', display: 'inline-block' }}/> Moradia</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--amber)', display: 'inline-block' }}/> Assinatura</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--accent)', display: 'inline-block' }}/> Outros</span>
            </div>
          </Card>
        </div>

        {/* Recurring list */}
        <div style={{ padding: '0 16px' }}>
          <SectionTitle title="Próximos pagamentos" action={`${recurring.length} itens`}/>
          <Card style={{ padding: '4px 0' }}>
            {recurring.map((r, i) => {
              const overdue = r.day < 13;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderBottom: i < recurring.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{
                    width: 42, textAlign: 'center', flexShrink: 0,
                    borderRight: '1px solid var(--border)', paddingRight: 10,
                  }}>
                    <div style={{ fontSize: 9, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{r.next.split('/')[1]}</div>
                    <div style={{ fontSize: 18, fontWeight: 650, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>{r.day.toString().padStart(2, '0')}</div>
                  </div>
                  <CategoryIcon cat={r.cat} size={32}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>
                      {categories.find((c) => c.id === r.cat)?.label} · recorrente
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>{BRL(r.amount)}</div>
                    {overdue
                      ? <Pill tone="primary" style={{ marginTop: 4 }}>Pago</Pill>
                      : <Pill tone="amber" style={{ marginTop: 4 }}>A vencer</Pill>}
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}
