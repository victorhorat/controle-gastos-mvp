import { useState } from 'react';
import { Icons } from '../components/Icons';
import { Card, ScreenHeader, HeaderIconBtn } from '../components/ui';
import { BRL, BRLshort } from '../data/appData';

export const HOUSING_TYPES = [
  { id: 'aluguel',    label: 'Aluguel',    abbr: 'Alg',  bg: '#4B5563', fg: '#fff', variable: false },
  { id: 'agua',       label: 'Água',       abbr: 'Águ',  bg: '#3B82F6', fg: '#fff', variable: true  },
  { id: 'luz',        label: 'Luz',        abbr: 'Luz',  bg: '#F59E0B', fg: '#fff', variable: true  },
  { id: 'internet',   label: 'Internet',   abbr: 'Net',  bg: '#0EA5E9', fg: '#fff', variable: false },
  { id: 'telefone',   label: 'Telefone',   abbr: 'Tel',  bg: '#8B5CF6', fg: '#fff', variable: false },
  { id: 'gas',        label: 'Gás',        abbr: 'Gás',  bg: '#EA580C', fg: '#fff', variable: true  },
  { id: 'condominio', label: 'Condomínio', abbr: 'Cnd',  bg: '#0D9488', fg: '#fff', variable: false },
  { id: 'iptu',       label: 'IPTU',       abbr: 'IPTU', bg: '#166534', fg: '#fff', variable: false },
];

const HT_MAP = Object.fromEntries(HOUSING_TYPES.map((t) => [t.id, t]));

const MONTHS_LABEL = ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai'];
const MONTHS_KEY   = ['2025-06','2025-07','2025-08','2025-09','2025-10','2025-11','2025-12','2026-01','2026-02','2026-03','2026-04','2026-05'];
const CURRENT_MONTH = '2026-05';

function HousingIcon({ typeId, size = 44 }) {
  const t = HT_MAP[typeId];
  if (!t) return null;
  const fs = t.abbr.length > 3 ? 9 : t.abbr.length > 2 ? 11 : t.abbr.length > 1 ? 13 : 18;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
      background: t.bg, color: t.fg,
      display: 'grid', placeItems: 'center',
      fontSize: fs, fontWeight: 800, letterSpacing: -0.3,
      fontFamily: 'var(--font-ui)',
    }}>{t.abbr}</div>
  );
}

function MiniBars({ history, color }) {
  const last6 = MONTHS_KEY.slice(-6).map((mk) => {
    const entry = history.find((h) => h.month === mk);
    return entry ? entry.amount : 0;
  });
  const max = Math.max(...last6, 1);
  const labels = MONTHS_LABEL.slice(-6);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 32 }}>
      {last6.map((v, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1 }}>
          <div style={{
            width: '100%', borderRadius: 3,
            height: Math.max(v / max * 28, v > 0 ? 4 : 2),
            background: i === 5
              ? color
              : `color-mix(in oklab, ${color} 35%, var(--surface-2))`,
            transition: 'height .2s',
          }}/>
          <div style={{ fontSize: 8, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: -0.3 }}>
            {labels[i]}
          </div>
        </div>
      ))}
    </div>
  );
}

function LogSheet({ bill, onSave, onClose }) {
  const t = HT_MAP[bill.type];
  const currentEntry = bill.history.find((h) => h.month === CURRENT_MONTH);
  const [amount, setAmount] = useState(currentEntry ? String(currentEntry.amount).replace('.', ',') : '');

  const handleSave = () => {
    const parsed = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) return;
    onSave(bill, CURRENT_MONTH, parsed);
  };

  const last3 = MONTHS_KEY.slice(-4, -1).map((mk, i) => {
    const entry = bill.history.find((h) => h.month === mk);
    return { label: MONTHS_LABEL[MONTHS_KEY.indexOf(mk)], amount: entry?.amount ?? null };
  });

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, backdropFilter: 'blur(2px)' }}/>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--surface-1)', borderRadius: '24px 24px 0 0',
        padding: '12px 20px 0', zIndex: 201,
        boxShadow: '0 -4px 32px rgba(0,0,0,0.14)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--surface-3)', margin: '0 auto 20px' }}/>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <HousingIcon typeId={bill.type} size={42}/>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Lançar maio</div>
            <div style={{ fontSize: 18, fontWeight: 650 }}>{t?.label}</div>
          </div>
        </div>

        {/* Histórico rápido dos últimos 3 meses */}
        {last3.some((x) => x.amount !== null) && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {last3.map((x, i) => (
              <div key={i} style={{
                flex: 1, padding: '8px 10px', borderRadius: 12,
                background: 'var(--surface-2)', textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 3 }}>{x.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: x.amount ? 'var(--text-1)' : 'var(--text-3)' }}>
                  {x.amount ? BRLshort(x.amount) : '—'}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Valor de maio (R$)</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--surface-2)', borderRadius: 14, padding: '14px 16px',
            border: '1.5px solid var(--accent)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-2)' }}>R$</span>
            <input
              autoFocus type="text" inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onClose(); }}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 600, color: 'var(--text-1)',
              }}
            />
          </div>
        </div>

        <div className="sheet-safe" style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: 14, borderRadius: 14,
            background: 'var(--surface-2)', border: 'none',
            fontSize: 14, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={handleSave} style={{
            flex: 2, padding: 14, borderRadius: 14,
            background: 'var(--text-1)', border: 'none',
            fontSize: 14, fontWeight: 650, color: 'var(--surface-1)', cursor: 'pointer',
          }}>Salvar</button>
        </div>
      </div>
    </>
  );
}

function AddBillSheet({ existing, onSave, onClose }) {
  const available = HOUSING_TYPES.filter((t) => !existing.includes(t.id));
  const [type,  setType]  = useState(null);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!type) return;
    onSave({ id: 'hb-' + Date.now(), type, notes: notes.trim(), history: [] });
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, backdropFilter: 'blur(2px)' }}/>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--surface-1)', borderRadius: '24px 24px 0 0',
        padding: '12px 20px 0', zIndex: 201,
        boxShadow: '0 -4px 32px rgba(0,0,0,0.14)',
        maxHeight: '92%', overflowY: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--surface-3)', margin: '0 auto 20px' }}/>
        <div style={{ fontSize: 18, fontWeight: 650, marginBottom: 20 }}>Nova conta de moradia</div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 12 }}>Tipo</div>
          {available.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-3)', padding: '12px 0' }}>Todos os tipos já foram adicionados.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {available.map((t) => {
                const active = type === t.id;
                return (
                  <button key={t.id} onClick={() => setType(t.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 14,
                    border: '1.5px solid ' + (active ? t.bg : 'var(--border)'),
                    background: active ? `color-mix(in oklab, ${t.bg} 10%, var(--surface-1))` : 'var(--surface-1)',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                      background: t.bg, color: t.fg, display: 'grid', placeItems: 'center',
                      fontSize: t.abbr.length > 3 ? 7 : t.abbr.length > 2 ? 9 : t.abbr.length > 1 ? 11 : 15,
                      fontWeight: 800,
                    }}>{t.abbr}</div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--text-1)' : 'var(--text-2)' }}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
            Observação <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
          </div>
          <input
            type="text"
            placeholder="Ex: Sabesp, Enel, Fibra 400mb…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--surface-2)', border: '1.5px solid var(--border)',
              borderRadius: 14, padding: '14px 16px',
              color: 'var(--text-1)', outline: 'none',
            }}
          />
        </div>

        <div className="sheet-safe" style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: 14, borderRadius: 14,
            background: 'var(--surface-2)', border: 'none',
            fontSize: 14, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={handleSave} style={{
            flex: 2, padding: 14, borderRadius: 14,
            background: !type ? 'var(--surface-3)' : 'var(--text-1)', border: 'none',
            fontSize: 14, fontWeight: 650,
            color: !type ? 'var(--text-3)' : 'var(--surface-1)',
            cursor: !type ? 'default' : 'pointer',
          }}>Adicionar</button>
        </div>
      </div>
    </>
  );
}

export function HousingBills({ onBack, bills = [], onLogAmount, onDeleteBill, onAddBill }) {
  const [logging, setLogging] = useState(null);
  const [adding, setAdding] = useState(false);

  const safeBills = Array.isArray(bills) ? bills : [];

  const totalThisMonth = safeBills.reduce((sum, bill) => {
    const entry = bill.history?.find((h) => h.month === CURRENT_MONTH);
    return sum + (entry?.amount ?? 0);
  }, 0);

  const loggedCount = safeBills.filter((b) => b.history?.some((h) => h.month === CURRENT_MONTH)).length;

  return (
    <>
      <div className="screen">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 16 }}>
          <ScreenHeader
            large title="Moradia"
            sub={`Maio · ${loggedCount}/${safeBills.length} lançados`}
            leading={<HeaderIconBtn onClick={onBack}><Icons.back size={18}/></HeaderIconBtn>}
            trailing={
              <button onClick={() => setAdding(true)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 999,
                background: 'var(--text-1)', border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 650, color: 'var(--surface-1)',
              }}>
                <Icons.plus size={14}/> Nova
              </button>
            }
          />

          {/* Hero */}
          <div style={{ padding: '0 16px' }}>
            <div className="cg-card cg-hero">
              <div style={{ fontSize: 11, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 0.6 }}>Total em maio</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 650, letterSpacing: -1, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
                {BRL(totalThisMonth)}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                {safeBills.length} conta{safeBills.length !== 1 ? 's' : ''} cadastradas
              </div>
            </div>
          </div>

          {/* Cards por conta */}
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {safeBills.map((bill) => {
              const t = HT_MAP[bill.type];
              if (!t) return null;
              const hist = bill.history ?? [];
              const currentEntry = hist.find((h) => h.month === CURRENT_MONTH);
              const prevEntry    = hist.find((h) => h.month === MONTHS_KEY[MONTHS_KEY.indexOf(CURRENT_MONTH) - 1]);
              const hasThis = !!currentEntry;
              const diff = hasThis && prevEntry ? currentEntry.amount - prevEntry.amount : null;

              return (
                <Card key={bill.id} style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                    <HousingIcon typeId={bill.type} size={44}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{t.label}</div>
                        {t.variable ? (
                          <div style={{
                            fontSize: 10, fontWeight: 650, padding: '2px 7px', borderRadius: 999,
                            background: 'color-mix(in oklab, var(--coral) 12%, transparent)',
                            color: 'var(--coral-strong)',
                          }}>Variável</div>
                        ) : (
                          <div style={{
                            fontSize: 10, fontWeight: 650, padding: '2px 7px', borderRadius: 999,
                            background: 'color-mix(in oklab, var(--accent) 14%, transparent)',
                            color: 'var(--accent-strong)',
                          }}>Fixo</div>
                        )}
                      </div>
                      {bill.notes ? (
                        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{bill.notes}</div>
                      ) : null}
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {hasThis ? (
                        <>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                            {BRL(currentEntry.amount)}
                          </div>
                          {diff !== null && (
                            <div style={{
                              fontSize: 11, fontWeight: 600, marginTop: 2,
                              color: diff > 0 ? 'var(--coral-strong)' : diff < 0 ? 'var(--accent-strong)' : 'var(--text-3)',
                            }}>
                              {diff > 0 ? '▲' : diff < 0 ? '▼' : '='} {BRLshort(Math.abs(diff))} vs abr
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>não lançado</div>
                      )}
                    </div>
                  </div>

                  {/* Mini bars */}
                  {hist.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <MiniBars history={hist} color={t.bg}/>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                    <button onClick={() => setLogging(bill)} style={{
                      flex: 2, padding: '10px 0', borderRadius: 10,
                      background: hasThis ? 'var(--surface-2)' : 'var(--text-1)',
                      border: 'none', cursor: 'pointer',
                      fontSize: 12, fontWeight: 650,
                      color: hasThis ? 'var(--text-2)' : 'var(--surface-1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <Icons.pencil size={13}/>
                      {hasThis ? 'Editar lançamento' : 'Lançar maio'}
                    </button>
                    <button onClick={() => onDeleteBill?.(bill.id)} style={{
                      flex: 1, padding: '10px 0', borderRadius: 10,
                      background: 'color-mix(in oklab, var(--coral) 10%, var(--surface-1))',
                      border: 'none', cursor: 'pointer',
                      fontSize: 12, fontWeight: 600, color: 'var(--coral-strong)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <Icons.trash size={13}/> Remover
                    </button>
                  </div>
                </Card>
              );
            })}

            <button onClick={() => setAdding(true)} style={{
              width: '100%', padding: 14, borderRadius: 14,
              background: 'transparent', border: '1px dashed var(--border)',
              color: 'var(--text-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>+ Nova conta</button>
          </div>
        </div>
      </div>

      {adding && (
        <AddBillSheet
          existing={safeBills.map((b) => b.type)}
          onSave={(bill) => { onAddBill?.(bill); setAdding(false); }}
          onClose={() => setAdding(false)}
        />
      )}
      {logging && (
        <LogSheet
          bill={logging}
          onSave={(bill, month, amount) => {
            onLogAmount(bill, month, amount);
            setLogging(null);
          }}
          onClose={() => setLogging(null)}
        />
      )}
    </>
  );
}
