import { useState, useRef } from 'react';
import { Icons } from '../components/Icons';
import { Card, SectionTitle, ScreenHeader, HeaderIconBtn, ProgressBar } from '../components/ui';
import { LineChart } from '../components/charts';
import { BRL, BRLshort, investments as initialInvestments, patrimonyHistory } from '../data/appData';

const kindHue = { Conta: 200, Caixinha: 175, CDB: 220, Poupança: 50, Tesouro: 280 };
const CHART_LABELS = ['Jun/25','Jul/25','Ago/25','Set/25','Out/25','Nov/25','Dez/25','Jan/26','Fev/26','Mar/26','Abr/26','Mai/26'];
const TODAY = new Date('2026-05-13');

const BANKS = [
  { id: 'Nubank',      abbr: 'Nu',    bg: '#8A05BE', fg: '#fff' },
  { id: 'Inter',       abbr: 'Inter', bg: '#FF7A00', fg: '#fff' },
  { id: 'Itaú',        abbr: 'Itaú',  bg: '#EC7000', fg: '#fff' },
  { id: 'Bradesco',    abbr: 'Brad',  bg: '#CC092F', fg: '#fff' },
  { id: 'Santander',   abbr: 'San',   bg: '#EC0000', fg: '#fff' },
  { id: 'Caixa',       abbr: 'CEF',   bg: '#005CA9', fg: '#fff' },
  { id: 'BB',          abbr: 'BB',    bg: '#F7C900', fg: '#003087' },
  { id: 'C6',          abbr: 'C6',    bg: '#242424', fg: '#fff' },
  { id: 'BTG',         abbr: 'BTG',   bg: '#00205B', fg: '#fff' },
  { id: 'XP',          abbr: 'XP',    bg: '#111',    fg: '#fff' },
  { id: 'PicPay',      abbr: 'PP',    bg: '#11C76F', fg: '#fff' },
  { id: 'Nuinvest',    abbr: 'Ni',    bg: '#8A05BE', fg: '#fff' },
  { id: 'Rico',        abbr: 'Rico',  bg: '#00B4A0', fg: '#fff' },
  { id: 'Sicoob',      abbr: 'Scb',   bg: '#006B3F', fg: '#fff' },
  { id: 'Sicredi',     abbr: 'Scr',   bg: '#007A33', fg: '#fff' },
  { id: 'Neon',        abbr: 'Neon',  bg: '#00CFFF', fg: '#111' },
  { id: 'Next',        abbr: 'Next',  bg: '#00E676', fg: '#111' },
  { id: 'Mercado Pago',abbr: 'MP',    bg: '#009EE3', fg: '#fff' },
  { id: 'Will Bank',   abbr: 'Will',  bg: '#FFDD00', fg: '#111' },
  { id: 'Outro',       abbr: '?',     bg: '#888',    fg: '#fff' },
];

const BANK_MAP = Object.fromEntries(BANKS.map((b) => [b.id, b]));

const KINDS = ['Conta', 'Poupança', 'Caixinha', 'CDB', 'Tesouro', 'Fundo', 'Ações', 'Cripto'];

function BankIcon({ inst, size = 38 }) {
  const bank = BANK_MAP[inst];
  const bg   = bank?.bg ?? '#888';
  const fg   = bank?.fg ?? '#fff';
  const abbr = bank?.abbr ?? inst?.slice(0, 2) ?? '?';
  const fs   = abbr.length > 3 ? 8 : abbr.length > 2 ? 10 : 12;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.32, flexShrink: 0,
      background: bg, color: fg,
      display: 'grid', placeItems: 'center',
      fontSize: fs, fontWeight: 700, letterSpacing: -0.3,
    }}>{abbr}</div>
  );
}

function maturityLabel(iso) {
  if (!iso) return null;
  const m = new Date(iso);
  const months = Math.round((m - TODAY) / (1000 * 60 * 60 * 24 * 30.44));
  const date = m.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  if (months <= 0) return { txt: 'Vencido', short: 'vencido', warn: true };
  if (months < 24) return { txt: `Vence em ${months}m · ${date}`, short: `${months}m`, warn: months < 6 };
  const years = Math.floor(months / 12);
  const rest  = months % 12;
  return { txt: `Vence em ${years}a ${rest}m · ${date}`, short: `${years}a`, warn: false };
}

function AddSheet({ onSave, onClose }) {
  const [step,    setStep]    = useState('bank'); // 'bank' | 'details'
  const [bank,    setBank]    = useState(null);
  const [kind,    setKind]    = useState('Conta');
  const [label,   setLabel]   = useState('');
  const [balance, setBalance] = useState('');
  const [purpose,  setPurpose]  = useState('');
  const [maturity, setMaturity] = useState('');
  const [growth,   setGrowth]   = useState('');
  const [liquid,   setLiquid]   = useState(false);

  const hasMaturity = !['Conta', 'Poupança', 'Caixinha'].includes(kind);

  const handleSave = () => {
    const parsed       = parseFloat(balance.replace(',', '.'));
    const parsedGrowth = growth ? parseFloat(growth.replace(',', '.')) / 100 : null;
    if (!bank || !label.trim() || isNaN(parsed) || parsed < 0) return;
    onSave({
      id:       'inv-' + Date.now(),
      inst:     bank.id,
      kind,
      label:    label.trim(),
      balance:  parsed,
      growth:   kind === 'Conta' ? null : parsedGrowth,
      purpose:  purpose.trim() || null,
      maturity: hasMaturity && maturity ? maturity : null,
      liquid:   kind !== 'Conta' ? liquid : false,
      history:  [parsed],
    });
  };

  const selectedBank = bank;

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, backdropFilter: 'blur(2px)' }}/>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--surface-1)', borderRadius: '24px 24px 0 0',
        padding: '12px 20px 0', zIndex: 201,
        boxShadow: '0 -4px 32px rgba(0,0,0,0.14)',
        maxHeight: '90%', overflowY: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--surface-3)', margin: '0 auto 20px' }}/>

        {step === 'bank' && (
          <>
            <div style={{ fontSize: 18, fontWeight: 650, marginBottom: 6 }}>Escolha o banco</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>Selecione onde está o dinheiro</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
              {BANKS.map((b) => {
                const active = selectedBank?.id === b.id;
                return (
                  <button key={b.id} onClick={() => setBank(b)} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    borderRadius: 14,
                    outline: active ? `2.5px solid var(--accent)` : '2.5px solid transparent',
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 16,
                      background: b.bg, color: b.fg,
                      display: 'grid', placeItems: 'center',
                      fontSize: b.abbr.length > 3 ? 9 : b.abbr.length > 2 ? 11 : 14,
                      fontWeight: 700, letterSpacing: -0.3,
                      boxShadow: active ? `0 0 0 3px color-mix(in oklab, ${b.bg} 30%, transparent)` : 'none',
                      transition: 'box-shadow .15s',
                    }}>{b.abbr}</div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: active ? 'var(--text-1)' : 'var(--text-2)', textAlign: 'center', lineHeight: 1.2 }}>{b.id}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{
                flex: 1, padding: 14, borderRadius: 14,
                background: 'var(--surface-2)', border: 'none',
                fontSize: 14, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer',
              }}>Cancelar</button>
              <button
                onClick={() => bank && setStep('details')}
                style={{
                  flex: 2, padding: 14, borderRadius: 14,
                  background: bank ? 'var(--text-1)' : 'var(--surface-3)', border: 'none',
                  fontSize: 14, fontWeight: 650, color: bank ? 'var(--surface-1)' : 'var(--text-3)', cursor: bank ? 'pointer' : 'default',
                  transition: 'all .15s',
                }}>Continuar</button>
            </div>
          </>
        )}

        {step === 'details' && (
          <>
            {/* Header com banco selecionado */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <button onClick={() => setStep('bank')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-2)', display: 'flex' }}>
                <Icons.back size={20}/>
              </button>
              <div style={{
                width: 40, height: 40, borderRadius: 13,
                background: bank.bg, color: bank.fg,
                display: 'grid', placeItems: 'center',
                fontSize: bank.abbr.length > 3 ? 9 : bank.abbr.length > 2 ? 11 : 14,
                fontWeight: 700,
              }}>{bank.abbr}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 650 }}>{bank.id}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Novo item</div>
              </div>
            </div>

            {/* Tipo */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>Tipo</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {KINDS.map((k) => (
                  <button key={k} onClick={() => setKind(k)} style={{
                    padding: '8px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                    background: kind === k ? 'var(--accent)' : 'var(--surface-2)',
                    color: kind === k ? '#fff' : 'var(--text-2)',
                    fontSize: 12, fontWeight: 600, transition: 'all .15s',
                  }}>{k}</button>
                ))}
              </div>
            </div>

            {/* Nome */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Nome</div>
              <input
                autoFocus
                type="text"
                placeholder={`Ex: ${kind === 'Conta' ? 'Conta Principal' : kind === 'CDB' ? 'CDB 110% CDI' : kind + ' ' + bank.id}`}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                  borderRadius: 14, padding: '14px 16px',
                  color: 'var(--text-1)', outline: 'none',
                }}
              />
            </div>

            {/* Saldo */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Saldo atual (R$)</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--surface-2)', borderRadius: 14, padding: '14px 16px',
                border: '1.5px solid var(--accent)',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-2)' }}>R$</span>
                <input
                  type="text" inputMode="decimal"
                  placeholder="0,00"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: 'var(--text-1)',
                  }}
                />
              </div>
            </div>

            {/* Vencimento (só para CDB, Tesouro, etc.) */}
            {hasMaturity && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
                  Vencimento <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
                </div>
                <input
                  type="date"
                  value={maturity}
                  onChange={(e) => setMaturity(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                    borderRadius: 14, padding: '14px 16px',
                    color: maturity ? 'var(--text-1)' : 'var(--text-3)', outline: 'none',
                  }}
                />
              </div>
            )}

            {/* Rendimento + Liquidez */}
            {kind !== 'Conta' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
                    Taxa de retorno anual <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', borderRadius: 14, padding: '14px 16px', border: '1.5px solid var(--border)' }}>
                    <input
                      type="text" inputMode="decimal"
                      placeholder="Ex: 12,5"
                      value={growth}
                      onChange={(e) => setGrowth(e.target.value)}
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}
                    />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-2)', fontWeight: 600 }}>%</span>
                  </div>
                </div>

                <button onClick={() => setLiquid((v) => !v)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', marginBottom: 14, padding: '14px 16px', borderRadius: 14,
                  background: liquid ? 'color-mix(in oklab, var(--accent) 8%, var(--surface-1))' : 'var(--surface-2)',
                  border: '1.5px solid ' + (liquid ? 'var(--accent)' : 'var(--border)'),
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    background: liquid ? 'var(--accent)' : 'var(--surface-3)',
                    display: 'grid', placeItems: 'center',
                    transition: 'background .15s',
                  }}>
                    {liquid && <Icons.check size={12} style={{ color: '#fff' }}/>}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Liquidez diária</div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>Pode resgatar a qualquer momento</div>
                  </div>
                </button>
              </>
            )}

            {/* Finalidade (opcional) */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
                Finalidade <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
              </div>
              <input
                type="text"
                placeholder="Ex: Viagem, Reserva de emergência…"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                  borderRadius: 14, padding: '14px 16px',
                  color: 'var(--text-1)', outline: 'none',
                }}
              />
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
              }}>Adicionar</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const ACTION_W = 130;

// allocations: [{ invId, targetType: 'value'|'pct', target: number }]
const initialGoals = initialInvestments
  .filter((i) => i.purpose)
  .map((i) => ({
    id: 'goal-' + i.id,
    name: i.purpose,
    allocations: [{ invId: i.id, targetType: 'value', target: Math.round(i.balance * 1.6 / 500) * 500 }],
  }));

function goalTotal(goal, investments) {
  return goal.allocations.reduce((sum, a) => {
    const inv = investments.find((i) => i.id === a.invId);
    if (!inv) return sum;
    return sum + (a.targetType === 'pct' ? inv.balance * a.target / 100 : a.target);
  }, 0);
}
function goalCurrent(goal, investments) {
  return goal.allocations.reduce((sum, a) => {
    const inv = investments.find((i) => i.id === a.invId);
    return sum + (inv?.balance ?? 0);
  }, 0);
}

function GoalSheet({ goal, investments, onSave, onClose }) {
  const editing = !!goal;
  const [name,        setName]        = useState(goal?.name ?? '');
  // allocations: { [invId]: { targetType, value } }
  const initAlloc = () => {
    const m = {};
    (goal?.allocations ?? []).forEach((a) => {
      m[a.invId] = { targetType: a.targetType, value: String(a.target).replace('.', ',') };
    });
    return m;
  };
  const [alloc, setAlloc] = useState(initAlloc);

  const selected = Object.keys(alloc);

  const toggle = (invId) => {
    setAlloc((prev) => {
      if (prev[invId]) { const n = { ...prev }; delete n[invId]; return n; }
      return { ...prev, [invId]: { targetType: 'value', value: '' } };
    });
  };
  const setAllocField = (invId, field, val) =>
    setAlloc((prev) => ({ ...prev, [invId]: { ...prev[invId], [field]: val } }));

  const totalTarget = selected.reduce((sum, id) => {
    const inv = investments.find((i) => i.id === id);
    const a   = alloc[id];
    const num = parseFloat(a.value.replace(',', '.')) || 0;
    return sum + (a.targetType === 'pct' ? (inv?.balance ?? 0) * num / 100 : num);
  }, 0);

  const handleSave = () => {
    if (!name.trim() || selected.length === 0) return;
    const allocations = selected.map((id) => {
      const a   = alloc[id];
      const num = parseFloat(a.value.replace(',', '.')) || 0;
      return { invId: id, targetType: a.targetType, target: num };
    }).filter((a) => a.target > 0);
    if (allocations.length === 0) return;
    onSave({ id: goal?.id ?? 'goal-' + Date.now(), name: name.trim(), allocations });
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
        <div style={{ fontSize: 18, fontWeight: 650, marginBottom: 20 }}>{editing ? 'Editar meta' : 'Nova meta'}</div>

        {/* Nome */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Nome da meta</div>
          <input
            autoFocus type="text"
            placeholder="Ex: Viagem Europa, Trocar de carro…"
            value={name} onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '14px 16px', color: 'var(--text-1)', outline: 'none' }}
          />
        </div>

        {/* Investimentos com valores individuais */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Distribuição por conta</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>Selecione e defina o valor ou % de cada</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {investments.map((inv) => {
              const active = !!alloc[inv.id];
              const a      = alloc[inv.id];
              return (
                <div key={inv.id} style={{
                  borderRadius: 14,
                  border: '1.5px solid ' + (active ? 'var(--accent)' : 'var(--border)'),
                  background: active ? 'color-mix(in oklab, var(--accent) 5%, var(--surface-1))' : 'var(--surface-1)',
                  overflow: 'hidden',
                  transition: 'border-color .15s',
                }}>
                  {/* Linha de seleção */}
                  <button onClick={() => toggle(inv.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    width: '100%', padding: '12px 14px',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      background: active ? 'var(--accent)' : 'var(--surface-3)',
                      display: 'grid', placeItems: 'center', transition: 'background .15s',
                    }}>
                      {active && <Icons.check size={12} style={{ color: '#fff' }}/>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>{inv.inst} · saldo {BRL(inv.balance)}</div>
                    </div>
                  </button>

                  {/* Inputs de valor/% quando ativo */}
                  {active && (
                    <div style={{ padding: '0 14px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                      {/* Toggle R$/% */}
                      <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: 10, padding: 3, gap: 2, flexShrink: 0 }}>
                        {['value', 'pct'].map((t) => (
                          <button key={t} onClick={() => setAllocField(inv.id, 'targetType', t)} style={{
                            padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                            background: a.targetType === t ? 'var(--accent)' : 'transparent',
                            color: a.targetType === t ? '#fff' : 'var(--text-2)',
                            fontSize: 11, fontWeight: 700, transition: 'all .15s',
                          }}>{t === 'value' ? 'R$' : '%'}</button>
                        ))}
                      </div>
                      {/* Input */}
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface-2)', borderRadius: 10, padding: '8px 12px' }}>
                        <input
                          type="text" inputMode="decimal"
                          placeholder={a.targetType === 'value' ? '0,00' : '0'}
                          value={a.value}
                          onChange={(e) => setAllocField(inv.id, 'value', e.target.value)}
                          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--text-1)', width: '100%' }}
                        />
                        {a.targetType === 'pct' && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-2)' }}>%</span>
                        )}
                      </div>
                      {/* Preview % em reais */}
                      {a.targetType === 'pct' && parseFloat(a.value.replace(',', '.')) > 0 && (
                        <span style={{ fontSize: 11, color: 'var(--accent-strong)', fontWeight: 600, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                          = {BRLshort(inv.balance * parseFloat(a.value.replace(',', '.')) / 100)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Total */}
        {selected.length > 0 && totalTarget > 0 && (
          <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 14, background: 'var(--surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 600 }}>Total da meta</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--accent-strong)' }}>{BRL(totalTarget)}</span>
          </div>
        )}

        <div className="sheet-safe" style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 14, borderRadius: 14, background: 'var(--surface-2)', border: 'none', fontSize: 14, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={handleSave} style={{ flex: 2, padding: 14, borderRadius: 14, background: 'var(--text-1)', border: 'none', fontSize: 14, fontWeight: 650, color: 'var(--surface-1)', cursor: 'pointer' }}>{editing ? 'Salvar' : 'Criar meta'}</button>
        </div>
      </div>
    </>
  );
}

function SwipeableGoalCard({ goal, investments, onEdit, onDelete }) {
  const linked  = investments.filter((i) => goal.allocations.some((a) => a.invId === i.id));
  const current = goalCurrent(goal, investments);
  const target  = goalTotal(goal, investments);
  const pct     = target > 0 ? Math.min(current / target, 1) : 0;

  const [offset,  setOffset]  = useState(0);
  const startX   = useRef(null);
  const startOff = useRef(0);
  const dragging = useRef(false);

  const beginDrag = (x) => { startX.current = x; startOff.current = offset; dragging.current = true; };
  const moveDrag  = (x) => {
    if (!dragging.current) return;
    setOffset(Math.min(0, Math.max(-ACTION_W, startOff.current + (x - startX.current))));
  };
  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setOffset(offset < -ACTION_W / 2 ? -ACTION_W : 0);
  };
  const close = () => { setOffset(0); dragging.current = false; };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, marginBottom: 10 }}>
      {/* Actions */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, display: 'flex', width: ACTION_W, borderRadius: '0 16px 16px 0', overflow: 'hidden' }}>
        <button onClick={() => { close(); onEdit(goal); }} style={{
          flex: 1, border: 'none', cursor: 'pointer',
          background: 'color-mix(in oklab, var(--accent) 85%, black)',
          color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <Icons.pencil size={18}/>
          <span style={{ fontSize: 10, fontWeight: 600 }}>Editar</span>
        </button>
        <button onClick={() => { close(); onDelete(goal.id); }} style={{
          flex: 1, border: 'none', cursor: 'pointer',
          background: 'var(--coral)',
          color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <Icons.trash size={18}/>
          <span style={{ fontSize: 10, fontWeight: 600 }}>Excluir</span>
        </button>
      </div>

      {/* Card */}
      <div
        onTouchStart={(e) => beginDrag(e.touches[0].clientX)}
        onTouchMove={(e)  => moveDrag(e.touches[0].clientX)}
        onTouchEnd={endDrag}
        onMouseDown={(e)  => beginDrag(e.clientX)}
        onMouseMove={(e)  => moveDrag(e.clientX)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        style={{
          userSelect: 'none',
          transform: `translateX(${offset}px)`,
          transition: dragging.current ? 'none' : 'transform .25s cubic-bezier(0.4,0,0.2,1)',
          position: 'relative', zIndex: 1,
        }}
      >
        <Card style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 650 }}>{goal.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>
                {linked.length === 0 ? '—' : linked.map((i) => i.label).join(' + ')}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: pct >= 1 ? 'var(--accent-strong)' : 'var(--text-1)' }}>
                {BRLshort(current)}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>
                de {BRLshort(target)}
              </div>
            </div>
          </div>
          <ProgressBar value={current} max={target} tone="primary"/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-2)' }}>
            <span>{Math.round(pct * 100)}% concluído</span>
            {pct < 1 && <span style={{ color: 'var(--accent-strong)', fontWeight: 600 }}>faltam {BRLshort(target - current)}</span>}
            {pct >= 1 && <span style={{ color: 'var(--accent-strong)', fontWeight: 600 }}>Meta atingida!</span>}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SwipeableInvRow({ inv, total, divider, onEdit, onDelete }) {
  const pct = (inv.balance / total * 100);
  const mat = inv.maturity ? maturityLabel(inv.maturity) : null;

  const [offset, setOffset]   = useState(0);
  const startX    = useRef(null);
  const startOff  = useRef(0);
  const dragging  = useRef(false);

  const beginDrag = (x) => { startX.current = x; startOff.current = offset; dragging.current = true; };
  const moveDrag  = (x) => {
    if (!dragging.current) return;
    const next = Math.min(0, Math.max(-ACTION_W, startOff.current + (x - startX.current)));
    setOffset(next);
  };
  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setOffset(offset < -ACTION_W / 2 ? -ACTION_W : 0);
  };
  const close = () => { setOffset(0); dragging.current = false; };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderBottom: divider ? '1px solid var(--border)' : 'none' }}>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, display: 'flex', width: ACTION_W }}>
        <button onClick={() => { close(); onEdit(inv); }} style={{
          flex: 1, border: 'none', cursor: 'pointer',
          background: 'color-mix(in oklab, var(--accent) 85%, black)',
          color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <Icons.pencil size={18}/>
          <span style={{ fontSize: 10, fontWeight: 600 }}>Editar</span>
        </button>
        <button onClick={() => { close(); onDelete(inv.id); }} style={{
          flex: 1, border: 'none', cursor: 'pointer',
          background: 'var(--coral)',
          color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <Icons.trash size={18}/>
          <span style={{ fontSize: 10, fontWeight: 600 }}>Excluir</span>
        </button>
      </div>

      <div
        onTouchStart={(e) => beginDrag(e.touches[0].clientX)}
        onTouchMove={(e)  => moveDrag(e.touches[0].clientX)}
        onTouchEnd={endDrag}
        onMouseDown={(e)  => beginDrag(e.clientX)}
        onMouseMove={(e)  => moveDrag(e.clientX)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        style={{
          userSelect: 'none',
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
          background: 'var(--surface-1)',
          transform: `translateX(${offset}px)`,
          transition: dragging.current ? 'none' : 'transform .25s cubic-bezier(0.4,0,0.2,1)',
          position: 'relative', zIndex: 1,
        }}
      >
        <BankIcon inst={inv.inst} size={38}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.label}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span>{inv.inst}</span>
            {(inv.kind === 'Conta' || inv.liquid) && (
              <span style={{ padding: '1px 6px', borderRadius: 6, background: 'var(--surface-2)', color: 'var(--text-3)', fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>líquido</span>
            )}
            {mat && (
              <span style={{
                padding: '1px 6px', borderRadius: 6,
                background: mat.warn ? 'color-mix(in oklab, var(--amber) 18%, transparent)' : 'var(--surface-2)',
                color: mat.warn ? 'var(--amber-strong)' : 'var(--text-2)',
                fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)',
              }}>{mat.short}</span>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{BRL(inv.balance)}</div>
          {inv.growth != null && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-strong)', marginTop: 2 }}>
              +{(inv.growth * 100).toFixed(1).replace('.', ',')}% a.a.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditInvSheet({ inv, onSave, onClose }) {
  const initialBank = BANK_MAP[inv.inst] ?? BANKS.find((b) => b.id === 'Outro');
  const [step,     setStep]     = useState('details');
  const [bank,     setBank]     = useState(initialBank);
  const [kind,     setKind]     = useState(inv.kind);
  const [label,    setLabel]    = useState(inv.label);
  const [balance,  setBalance]  = useState(String(inv.balance).replace('.', ','));
  const [maturity, setMaturity] = useState(inv.maturity ?? '');
  const [purpose,  setPurpose]  = useState(inv.purpose ?? '');
  const [growth,   setGrowth]   = useState(inv.growth != null ? String((inv.growth * 100).toFixed(2)).replace('.', ',') : '');
  const [liquid,   setLiquid]   = useState(inv.liquid ?? false);

  const hasMaturity = !['Conta', 'Poupança', 'Caixinha'].includes(kind);

  const handleSave = () => {
    const parsed       = parseFloat(balance.replace(',', '.'));
    const parsedGrowth = growth ? parseFloat(growth.replace(',', '.')) / 100 : null;
    if (!bank || !label.trim() || isNaN(parsed) || parsed < 0) return;
    onSave({
      ...inv,
      inst:     bank.id,
      kind,
      label:    label.trim(),
      balance:  parsed,
      growth:   kind === 'Conta' ? null : parsedGrowth,
      purpose:  purpose.trim() || null,
      maturity: hasMaturity && maturity ? maturity : null,
      liquid:   kind !== 'Conta' ? liquid : false,
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
        maxHeight: '90%', overflowY: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--surface-3)', margin: '0 auto 20px' }}/>

        {step === 'bank' && (
          <>
            <div style={{ fontSize: 18, fontWeight: 650, marginBottom: 20 }}>Escolha o banco</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
              {BANKS.map((b) => {
                const active = bank?.id === b.id;
                return (
                  <button key={b.id} onClick={() => setBank(b)} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    borderRadius: 14, outline: active ? '2.5px solid var(--accent)' : '2.5px solid transparent',
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 16,
                      background: b.bg, color: b.fg,
                      display: 'grid', placeItems: 'center',
                      fontSize: b.abbr.length > 3 ? 9 : b.abbr.length > 2 ? 11 : 14,
                      fontWeight: 700,
                    }}>{b.abbr}</div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: active ? 'var(--text-1)' : 'var(--text-2)', textAlign: 'center' }}>{b.id}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('details')} style={{ flex: 1, padding: 14, borderRadius: 14, background: 'var(--surface-2)', border: 'none', fontSize: 14, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer' }}>Voltar</button>
              <button onClick={() => setStep('details')} style={{ flex: 2, padding: 14, borderRadius: 14, background: 'var(--text-1)', border: 'none', fontSize: 14, fontWeight: 650, color: 'var(--surface-1)', cursor: 'pointer' }}>Confirmar</button>
            </div>
          </>
        )}

        {step === 'details' && (
          <>
            <div style={{ fontSize: 18, fontWeight: 650, marginBottom: 20 }}>Editar item</div>

            {/* Banco */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Banco / Instituição</div>
              <button onClick={() => setStep('bank')} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '12px 14px', borderRadius: 14,
                background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <BankIcon inst={bank?.id} size={34}/>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{bank?.id ?? 'Selecionar'}</span>
                <Icons.arrow_r size={16} style={{ color: 'var(--text-3)' }}/>
              </button>
            </div>

            {/* Tipo */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>Tipo</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {KINDS.map((k) => (
                  <button key={k} onClick={() => setKind(k)} style={{
                    padding: '8px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                    background: kind === k ? 'var(--accent)' : 'var(--surface-2)',
                    color: kind === k ? '#fff' : 'var(--text-2)',
                    fontSize: 12, fontWeight: 600, transition: 'all .15s',
                  }}>{k}</button>
                ))}
              </div>
            </div>

            {/* Nome */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Nome</div>
              <input autoFocus type="text" value={label} onChange={(e) => setLabel(e.target.value)} style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                borderRadius: 14, padding: '14px 16px', color: 'var(--text-1)', outline: 'none',
              }}/>
            </div>

            {/* Saldo */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Saldo atual (R$)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', borderRadius: 14, padding: '14px 16px', border: '1.5px solid var(--accent)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-2)' }}>R$</span>
                <input type="text" inputMode="decimal" value={balance} onChange={(e) => setBalance(e.target.value)} style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: 'var(--text-1)',
                }}/>
              </div>
            </div>

            {/* Vencimento */}
            {hasMaturity && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
                  Vencimento <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
                </div>
                <input type="date" value={maturity} onChange={(e) => setMaturity(e.target.value)} style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                  borderRadius: 14, padding: '14px 16px',
                  fontSize: 14, color: maturity ? 'var(--text-1)' : 'var(--text-3)', outline: 'none',
                }}/>
              </div>
            )}

            {/* Rendimento + Liquidez */}
            {kind !== 'Conta' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
                    Taxa de retorno anual <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', borderRadius: 14, padding: '14px 16px', border: '1.5px solid var(--border)' }}>
                    <input
                      type="text" inputMode="decimal"
                      placeholder="Ex: 12,5"
                      value={growth}
                      onChange={(e) => setGrowth(e.target.value)}
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}
                    />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-2)', fontWeight: 600 }}>%</span>
                  </div>
                </div>

                <button onClick={() => setLiquid((v) => !v)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', marginBottom: 14, padding: '14px 16px', borderRadius: 14,
                  background: liquid ? 'color-mix(in oklab, var(--accent) 8%, var(--surface-1))' : 'var(--surface-2)',
                  border: '1.5px solid ' + (liquid ? 'var(--accent)' : 'var(--border)'),
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    background: liquid ? 'var(--accent)' : 'var(--surface-3)',
                    display: 'grid', placeItems: 'center', transition: 'background .15s',
                  }}>
                    {liquid && <Icons.check size={12} style={{ color: '#fff' }}/>}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Liquidez diária</div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>Pode resgatar a qualquer momento</div>
                  </div>
                </button>
              </>
            )}

            {/* Finalidade */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
                Finalidade <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
              </div>
              <input type="text" placeholder="Ex: Reserva de emergência, Viagem…" value={purpose} onChange={(e) => setPurpose(e.target.value)} style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                borderRadius: 14, padding: '14px 16px', color: 'var(--text-1)', outline: 'none',
              }}/>
            </div>

            <div className="sheet-safe" style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: 14, borderRadius: 14, background: 'var(--surface-2)', border: 'none', fontSize: 14, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSave} style={{ flex: 2, padding: 14, borderRadius: 14, background: 'var(--text-1)', border: 'none', fontSize: 14, fontWeight: 650, color: 'var(--surface-1)', cursor: 'pointer' }}>Salvar</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export function Patrimony({ onBack }) {
  const [investments,  setInvestments]  = useState(initialInvestments);
  const [showAdd,      setShowAdd]      = useState(false);
  const [editingInv,   setEditingInv]   = useState(null);
  const [goals,        setGoals]        = useState(initialGoals);
  const [goalSheet,    setGoalSheet]    = useState(null); // null | 'new' | goal object

  const total = investments.reduce((s, x) => s + x.balance, 0);
  const prev = patrimonyHistory[patrimonyHistory.length - 2];
  const growthAbs = total - prev;
  const growthPct = growthAbs / prev * 100;

  const handleAdd = (item) => { setInvestments((prev) => [...prev, item]); setShowAdd(false); };
  const handleDelete    = (id)  => setInvestments((prev) => prev.filter((x) => x.id !== id));
  const handleSaveEdit  = (upd) => { setInvestments((prev) => prev.map((x) => x.id === upd.id ? upd : x)); setEditingInv(null); };

  const handleSaveGoal  = (g)   => { setGoals((prev) => prev.some((x) => x.id === g.id) ? prev.map((x) => x.id === g.id ? g : x) : [...prev, g]); setGoalSheet(null); };
  const handleDeleteGoal = (id) => setGoals((prev) => prev.filter((g) => g.id !== id));

  return (
    <>
      <div className="screen">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 16 }}>
          <ScreenHeader
            large title="Patrimônio"
            sub={`${investments.length} itens · contas + investimentos`}
            leading={<HeaderIconBtn onClick={onBack}><Icons.back size={18}/></HeaderIconBtn>}
            trailing={<HeaderIconBtn onClick={() => setShowAdd(true)}><Icons.plus size={18}/></HeaderIconBtn>}
          />

          {/* Hero */}
          <div style={{ padding: '0 16px' }}>
            <div className="cg-card cg-hero">
              <div style={{ fontSize: 11, opacity: 0.75, letterSpacing: 0.6, textTransform: 'uppercase' }}>Patrimônio total</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 650, letterSpacing: -0.8, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{BRL(total)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '4px 9px', borderRadius: 999, background: 'rgba(255,255,255,0.18)',
                  fontSize: 11, fontWeight: 600,
                }}>
                  <Icons.arrow_up size={10} stroke={2.4}/>
                  +{BRL(growthAbs)} <span style={{ opacity: 0.8 }}>({growthPct.toFixed(1).replace('.', ',')}% este mês)</span>
                </div>
              </div>
              <div style={{ marginTop: 16, marginLeft: -4, marginRight: -4 }}>
                <LineChart values={patrimonyHistory} height={70} accent="#fff" labels={CHART_LABELS}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, opacity: 0.6, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                <span>Jun/25</span><span>Mai/26</span>
              </div>
            </div>
          </div>

          {/* Finalidades */}
          <div style={{ padding: '0 16px' }}>
            <SectionTitle
              title="Para o quê você está guardando"
              action="+ Nova meta"
              onAction={() => setGoalSheet('new')}
            />
            {goals.length === 0 ? (
              <button onClick={() => setGoalSheet('new')} style={{
                width: '100%', padding: 14, borderRadius: 14,
                background: 'transparent', border: '1px dashed var(--border)',
                color: 'var(--text-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>+ Adicionar primeira meta</button>
            ) : (
              <div>
                {goals.map((goal) => (
                  <SwipeableGoalCard
                    key={goal.id} goal={goal} investments={investments}
                    onEdit={(g) => setGoalSheet(g)}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Lista */}
          <div style={{ padding: '0 16px' }}>
            <SectionTitle title="Onde está seu dinheiro" action={`${investments.length} itens`}/>
            <Card style={{ padding: 0 }}>
              {investments.map((inv, i) => (
                <SwipeableInvRow
                  key={inv.id} inv={inv} total={total}
                  divider={i < investments.length - 1}
                  onEdit={setEditingInv}
                  onDelete={handleDelete}
                />
              ))}
            </Card>
            <button onClick={() => setShowAdd(true)} style={{
              marginTop: 10, width: '100%', padding: 14, borderRadius: 14,
              background: 'transparent', border: '1px dashed var(--border)',
              color: 'var(--text-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>+ Adicionar conta ou investimento</button>
          </div>
        </div>
      </div>

      {showAdd    && <AddSheet     onSave={handleAdd}       onClose={() => setShowAdd(false)}/>}
      {editingInv && <EditInvSheet inv={editingInv}         onSave={handleSaveEdit}  onClose={() => setEditingInv(null)}/>}
      {goalSheet  && <GoalSheet   goal={goalSheet === 'new' ? null : goalSheet} investments={investments} onSave={handleSaveGoal} onClose={() => setGoalSheet(null)}/>}
    </>
  );
}
