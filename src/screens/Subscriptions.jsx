import { useState } from 'react';
import { Icons } from '../components/Icons';
import { Card, ScreenHeader, HeaderIconBtn } from '../components/ui';
import { BRL } from '../data/appData';

export const SERVICES = [
  { id: 'netflix',    label: 'Netflix',      abbr: 'N',   bg: '#E50914', fg: '#fff' },
  { id: 'disney',     label: 'Disney+',      abbr: 'D+',  bg: '#113CCF', fg: '#fff' },
  { id: 'hbo',        label: 'HBO Max',      abbr: 'Max', bg: '#111111', fg: '#fff' },
  { id: 'amazon',     label: 'Amazon',       abbr: 'a',   bg: '#00A8E1', fg: '#fff' },
  { id: 'claude',     label: 'Claude',       abbr: 'Cl',  bg: '#C96442', fg: '#fff' },
  { id: 'totalpass',  label: 'TotalPass',    abbr: 'TP',  bg: '#AADC32', fg: '#1a1a1a' },
  { id: 'spotify',    label: 'Spotify',      abbr: '♪',   bg: '#1DB954', fg: '#fff' },
];

const SVC_MAP = Object.fromEntries(SERVICES.map((s) => [s.id, s]));

function ServiceIcon({ serviceId, size = 44 }) {
  const s = SVC_MAP[serviceId];
  if (!s) return null;
  const fs = s.abbr.length > 2 ? 10 : s.abbr.length > 1 ? 13 : 18;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
      background: s.bg, color: s.fg,
      display: 'grid', placeItems: 'center',
      fontSize: fs, fontWeight: 800, letterSpacing: -0.5,
      fontFamily: 'var(--font-ui)',
    }}>{s.abbr}</div>
  );
}

export function AddSheet({ editing, onSave, onClose }) {
  const [service,  setService]  = useState(editing?.service ?? null);
  const [amount,   setAmount]   = useState(editing ? String(editing.amount).replace('.', ',') : '');
  const [monthly,  setMonthly]  = useState(editing?.monthly ?? true);
  const [day,      setDay]      = useState(editing?.day ? String(editing.day) : '');
  const [notes,    setNotes]    = useState(editing?.notes ?? '');

  const handleSave = () => {
    if (!service) return;
    const parsed = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) return;
    onSave({
      id:      editing?.id ?? 'sub-' + Date.now(),
      service,
      label:   '',
      amount:  parsed,
      monthly,
      day:     parseInt(day) || 1,
      notes:   notes.trim(),
    });
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
        <div style={{ fontSize: 18, fontWeight: 650, marginBottom: 20 }}>
          {editing ? 'Editar assinatura' : 'Nova assinatura'}
        </div>

        {/* Service picker */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 12 }}>Serviço</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {SERVICES.map((s) => {
              const active = service === s.id;
              return (
                <button key={s.id} onClick={() => setService(s.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 14,
                  border: '1.5px solid ' + (active ? s.bg : 'var(--border)'),
                  background: active ? `color-mix(in oklab, ${s.bg} 10%, var(--surface-1))` : 'var(--surface-1)',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                    background: s.bg, color: s.fg,
                    display: 'grid', placeItems: 'center',
                    fontSize: s.abbr.length > 2 ? 8 : s.abbr.length > 1 ? 11 : 15,
                    fontWeight: 800,
                  }}>{s.abbr}</div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--text-1)' : 'var(--text-2)' }}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Valor (R$)</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--surface-2)', borderRadius: 14, padding: '14px 16px',
            border: '1.5px solid var(--accent)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-2)' }}>R$</span>
            <input
              type="text" inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: 'var(--text-1)',
              }}
            />
          </div>
        </div>

        {/* Recorrência + Dia */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Recorrência</div>
            <div style={{ display: 'flex', padding: 3, background: 'var(--surface-2)', borderRadius: 12, gap: 2 }}>
              {[{ v: true, l: 'Mensal' }, { v: false, l: 'Única' }].map(({ v, l }) => (
                <button key={String(v)} onClick={() => setMonthly(v)} style={{
                  flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: monthly === v ? 'var(--surface-1)' : 'transparent',
                  color: monthly === v ? 'var(--text-1)' : 'var(--text-2)',
                  fontSize: 12, fontWeight: 600,
                  boxShadow: monthly === v ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all .15s',
                }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
              Dia de cobrança
            </div>
            <input
              type="text" inputMode="numeric"
              placeholder="Ex: 10"
              value={day}
              onChange={(e) => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                borderRadius: 12, padding: '12px 14px',
                fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-1)', outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
            Observação <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
          </div>
          <input
            type="text"
            placeholder="Ex: Plano familiar, Plano Pro…"
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
            background: !service ? 'var(--surface-3)' : 'var(--text-1)', border: 'none',
            fontSize: 14, fontWeight: 650,
            color: !service ? 'var(--text-3)' : 'var(--surface-1)',
            cursor: !service ? 'default' : 'pointer',
          }}>{editing ? 'Salvar' : 'Adicionar'}</button>
        </div>
      </div>
    </>
  );
}

function subToTxn(sub) {
  const day = String(sub.day || 1).padStart(2, '0');
  const date = `2026-05-${day.length > 2 ? '01' : day}`;
  return {
    id:     'txn-sub-' + sub.id,
    type:   'expense',
    cat:    'assin',
    subId:  sub.id,
    desc:   SERVICES.find((s) => s.id === sub.service)?.label ?? sub.service,
    amount: sub.amount,
    date,
    method: 'Crédito',
  };
}

export function Subscriptions({ onBack, subs, onAddSub, onDeleteSub, onAddTxn }) {
  const [sheet, setSheet] = useState(null); // null | 'new' | sub object

  const total = subs.filter((s) => s.monthly).reduce((acc, s) => acc + s.amount, 0);

  const handleSave = (sub) => {
    onAddSub(sub);
    if (onAddTxn) onAddTxn(subToTxn(sub));
    setSheet(null);
  };
  const handleDelete = (id) => onDeleteSub(id);

  return (
    <>
      <div className="screen">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 16 }}>
          <ScreenHeader
            large title="Assinaturas"
            sub={`${subs.length} ativas · ${BRL(total)}/mês`}
            leading={<HeaderIconBtn onClick={onBack}><Icons.back size={18}/></HeaderIconBtn>}
            trailing={
              <button onClick={() => setSheet('new')} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 999,
                background: 'var(--text-1)', border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 650, color: 'var(--surface-1)',
              }}>
                <Icons.plus size={14}/> Nova
              </button>
            }
          />

          {/* Total hero */}
          <div style={{ padding: '0 16px' }}>
            <div className="cg-card cg-hero">
              <div style={{ fontSize: 11, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 0.6 }}>Total mensal</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 650, letterSpacing: -1, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
                {BRL(total)}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                {BRL(total * 12)}/ano · {subs.filter((s) => s.monthly).length} assinaturas recorrentes
              </div>
            </div>
          </div>

          {/* Lista */}
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {subs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)', fontSize: 14 }}>
                Nenhuma assinatura cadastrada
              </div>
            )}
            {subs.map((sub) => {
              const svc = SVC_MAP[sub.service];
              if (!svc) return null;
              return (
                <Card key={sub.id} style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Icon with brand color accent bar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <ServiceIcon serviceId={sub.service} size={48}/>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{svc.label}</div>
                        <div style={{
                          fontSize: 10, fontWeight: 650, padding: '2px 7px', borderRadius: 999,
                          background: sub.monthly
                            ? 'color-mix(in oklab, var(--accent) 14%, transparent)'
                            : 'var(--surface-2)',
                          color: sub.monthly ? 'var(--accent-strong)' : 'var(--text-2)',
                        }}>{sub.monthly ? 'Mensal' : 'Única'}</div>
                      </div>
                      {sub.notes ? (
                        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{sub.notes}</div>
                      ) : null}
                      {sub.monthly && sub.day ? (
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>
                          Cobrado todo dia {sub.day}
                        </div>
                      ) : null}
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        {BRL(sub.amount)}
                      </div>
                      {sub.monthly && (
                        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                          {BRL(sub.amount * 12)}/ano
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    <button onClick={() => setSheet(sub)} style={{
                      flex: 1, padding: '9px 0', borderRadius: 10,
                      background: 'var(--surface-2)', border: 'none', cursor: 'pointer',
                      fontSize: 12, fontWeight: 600, color: 'var(--text-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <Icons.pencil size={13}/> Editar
                    </button>
                    <button onClick={() => handleDelete(sub.id)} style={{
                      flex: 1, padding: '9px 0', borderRadius: 10,
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
            <button onClick={() => setSheet('new')} style={{
              width: '100%', padding: 14, borderRadius: 14,
              background: 'transparent', border: '1px dashed var(--border)',
              color: 'var(--text-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>+ Nova assinatura</button>
          </div>
        </div>
      </div>

      {sheet && (
        <AddSheet
          editing={sheet === 'new' ? null : sheet}
          onSave={handleSave}
          onClose={() => setSheet(null)}
        />
      )}
    </>
  );
}
