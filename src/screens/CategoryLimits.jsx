import { useState } from 'react';
import { Icons } from '../components/Icons';
import { Card, CategoryIcon, ScreenHeader, HeaderIconBtn } from '../components/ui';
import { BRL, BRLshort, categories, spending as initialSpending } from '../data/appData';

function EditSheet({ cat, currentLimit, onSave, onClose }) {
  const c = categories.find((x) => x.id === cat);
  const [value, setValue] = useState(String(currentLimit));

  const handleSave = () => {
    const parsed = parseFloat(value.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) onSave(parsed);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
        zIndex: 200, backdropFilter: 'blur(2px)',
      }}/>

      {/* Sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--surface-1)',
        borderRadius: '24px 24px 0 0',
        padding: '12px 20px 40px',
        zIndex: 201,
        boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--surface-3)', margin: '0 auto 20px' }}/>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <CategoryIcon cat={cat} size={40}/>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Limite mensal</div>
            <div style={{ fontSize: 18, fontWeight: 650, marginTop: 2 }}>{c.label}</div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Novo limite (R$)</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--surface-2)', borderRadius: 14, padding: '14px 16px',
            border: '1.5px solid var(--accent)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-2)' }}>R$</span>
            <input
              autoFocus
              type="number"
              min="0"
              step="50"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKey}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600,
                color: 'var(--text-1)', width: '100%',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: 14, borderRadius: 14,
            background: 'var(--surface-2)', border: 'none',
            fontSize: 14, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={handleSave} style={{
            flex: 2, padding: 14, borderRadius: 14,
            background: 'var(--text-1)', border: 'none',
            fontSize: 14, fontWeight: 650, color: 'var(--surface-1)', cursor: 'pointer',
          }}>Salvar limite</button>
        </div>
      </div>
    </>
  );
}

export function CategoryLimits({ onBack }) {
  const [limits, setLimits] = useState(
    Object.fromEntries(initialSpending.map((s) => [s.cat, s.plan]))
  );
  const [editing, setEditing] = useState(null);

  const spending = initialSpending.map((s) => ({ ...s, plan: limits[s.cat] }));
  const totalSpend = spending.reduce((s, x) => s + x.value, 0);
  const totalPlan  = spending.reduce((s, x) => s + x.plan, 0);
  const overCount  = spending.filter((s) => s.value > s.plan).length;

  const saveLimit = (cat, newPlan) => {
    setLimits((prev) => ({ ...prev, [cat]: newPlan }));
    setEditing(null);
  };

  return (
    <>
      <div className="screen">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 16 }}>
          <ScreenHeader
            large title="Limites por categoria"
            sub={`Maio · ${overCount > 0 ? `${overCount} acima do limite` : 'tudo dentro do planejado'}`}
            leading={<HeaderIconBtn onClick={onBack}><Icons.back size={18}/></HeaderIconBtn>}
          />

          {/* Resumo geral */}
          <div style={{ padding: '0 16px' }}>
            <div className="cg-card cg-hero">
              <div style={{ fontSize: 11, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 0.6 }}>Total gasto em maio</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 650, letterSpacing: -0.8, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
                {BRL(totalSpend)}
              </div>
              <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>de {BRL(totalPlan)} planejado</div>
              <div style={{ marginTop: 14, height: 7, background: 'rgba(255,255,255,0.18)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  width: Math.min(totalSpend / totalPlan, 1) * 100 + '%',
                  height: '100%', background: '#fff', borderRadius: 999, transition: 'width .3s',
                }}/>
              </div>
            </div>
          </div>

          {/* Lista */}
          <div style={{ padding: '0 16px' }}>
            <Card style={{ padding: '4px 0' }}>
              {spending.map((s, i) => {
                const c = categories.find((x) => x.id === s.cat);
                const over = s.value > s.plan;
                const barPct = Math.min(s.value / s.plan, 1) * 100;
                return (
                  <div key={s.cat} style={{
                    padding: '14px 16px',
                    borderBottom: i < spending.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <CategoryIcon cat={s.cat} size={34}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</div>
                        {over && (
                          <div style={{ fontSize: 11, color: 'var(--coral-strong)', fontWeight: 600, marginTop: 1 }}>
                            + {BRLshort(s.value - s.plan)} acima
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: over ? 'var(--coral-strong)' : 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}>
                          {BRL(s.value)}
                        </div>
                        <button
                          onClick={() => setEditing(s.cat)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                            fontFamily: 'var(--font-mono)', fontSize: 11,
                            color: 'var(--accent-strong)', fontWeight: 600, marginTop: 1,
                            display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end',
                          }}
                        >
                          <Icons.pencil size={10}/>
                          limite {BRL(s.plan)}
                        </button>
                      </div>
                    </div>
                    <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{
                        width: barPct + '%', height: '100%',
                        background: over ? 'var(--coral)' : `oklch(0.62 0.14 ${c.hue})`,
                        borderRadius: 999, transition: 'width .3s',
                      }}/>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      </div>

      {editing && (
        <EditSheet
          cat={editing}
          currentLimit={limits[editing]}
          onSave={(newPlan) => saveLimit(editing, newPlan)}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
