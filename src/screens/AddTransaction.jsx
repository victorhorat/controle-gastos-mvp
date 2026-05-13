import { useState } from 'react';
import { Icons } from '../components/Icons';
import { Card, CategoryIcon, ScreenHeader, HeaderIconBtn } from '../components/ui';
import { categories } from '../data/appData';

const METHODS = ['PIX', 'Crédito', 'Débito', 'Boleto', 'Dinheiro', 'Transf.'];

const TODAY = '2026-05-13';

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

export function AddTransaction({ onClose, onNavigate }) {
  const [kind,   setKind]   = useState('expense');
  const [amount, setAmount] = useState('');
  const [desc,   setDesc]   = useState('');
  const [cat,    setCat]    = useState('alim');
  const [src,    setSrc]    = useState('');
  const [date,   setDate]   = useState(TODAY);
  const [method, setMethod] = useState('PIX');

  const accentColor = kind === 'income' ? 'var(--accent-strong)' : 'var(--text-1)';

  return (
    <div className="screen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 16 }}>
        <ScreenHeader
          large title="Nova transação"
          leading={<HeaderIconBtn onClick={onClose}><Icons.close size={18}/></HeaderIconBtn>}
        />

        {/* Kind toggle */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', padding: 5, background: 'var(--surface-2)', borderRadius: 16, gap: 4 }}>
            {[
              { id: 'expense', l: 'Despesa', i: <Icons.arrow_up size={14} stroke={2}/> },
              { id: 'income',  l: 'Receita', i: <Icons.arrow_dn size={14} stroke={2}/> },
            ].map((s) => (
              <button key={s.id} onClick={() => setKind(s.id)} style={{
                flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: kind === s.id ? (s.id === 'income' ? 'var(--accent)' : 'var(--coral)') : 'transparent',
                color: kind === s.id ? '#fff' : 'var(--text-2)',
                fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all .2s',
              }}>{s.i} {s.l}</button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div style={{ padding: '4px 20px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Valor</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 18, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>R$</span>
            <input
              type="text" inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                background: 'none', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 44, fontWeight: 600,
                letterSpacing: -1.5, fontVariantNumeric: 'tabular-nums',
                color: accentColor, width: Math.max((amount.length || 4) * 26, 100) + 'px',
                textAlign: 'center',
              }}
            />
          </div>
          <div style={{ height: 2, background: 'var(--accent)', width: 80, margin: '8px auto 0', borderRadius: 2 }}/>
        </div>

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Description */}
          <Card style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Descrição</div>
            <input
              type="text"
              placeholder={kind === 'income' ? 'Ex: Salário, Freelance…' : 'Ex: Mercado, Restaurante…'}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'none', border: 'none', outline: 'none',
                fontSize: 15, fontWeight: 500, color: 'var(--text-1)',
                fontFamily: 'var(--font-ui)',
              }}
            />
          </Card>

          {/* Category / Source */}
          {kind === 'expense' ? (
            <Card style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Categoria</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {cat === 'moradia' && (
                    <button onClick={() => onNavigate?.('housingBills')} style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      fontSize: 11, fontWeight: 600, color: 'var(--accent-strong)',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <Icons.calendar size={12}/> É recorrente?
                    </button>
                  )}
                  <button onClick={() => onNavigate?.('subscriptions')} style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontSize: 11, fontWeight: 600, color: 'var(--accent-strong)',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <Icons.receipt size={12}/> É uma assinatura?
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                {categories.filter((c) => c.id !== 'assin').slice(0, 9).map((c) => (
                  <button key={c.id} onClick={() => setCat(c.id)} style={{
                    background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}>
                    <div style={{
                      padding: 2, borderRadius: 14,
                      background: cat === c.id ? 'var(--accent)' : 'transparent',
                      transition: 'background .15s',
                    }}>
                      <CategoryIcon cat={c.id} size={38}/>
                    </div>
                    <div style={{ fontSize: 9, color: cat === c.id ? 'var(--text-1)' : 'var(--text-2)', fontWeight: cat === c.id ? 600 : 500 }}>{c.label}</div>
                  </button>
                ))}
              </div>
            </Card>
          ) : (
            <Card style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Origem da renda</div>
              <input
                type="text"
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                placeholder="Ex: Salário, Freelance, Aluguel…"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                  borderRadius: 14, padding: '14px 16px',
                  fontWeight: 500, color: 'var(--text-1)', outline: 'none',
                  fontFamily: 'var(--font-ui)',
                }}
              />
            </Card>
          )}

          {/* Date */}
          <Card style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Data</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icons.calendar size={16} style={{ color: 'var(--text-3)', flexShrink: 0 }}/>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  background: 'none', border: 'none', outline: 'none',
                  fontSize: 15, fontWeight: 500, color: 'var(--text-1)',
                  fontFamily: 'var(--font-ui)', flex: 1,
                  colorScheme: 'light',
                }}
              />
            </div>
          </Card>

          {/* Payment method */}
          <Card style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>
              {kind === 'income' ? 'Conta de destino' : 'Forma de pagamento'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {METHODS.map((m) => (
                <button key={m} onClick={() => setMethod(m)} style={{
                  padding: '7px 14px', borderRadius: 999,
                  border: '1.5px solid ' + (method === m ? 'var(--accent)' : 'var(--border)'),
                  background: method === m ? 'color-mix(in oklab, var(--accent) 12%, var(--surface-1))' : 'var(--surface-2)',
                  color: method === m ? 'var(--accent-strong)' : 'var(--text-2)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  transition: 'all .15s',
                }}>{m}</button>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ padding: '8px 16px 0' }}>
          <button className="cg-primary-btn">
            {kind === 'income' ? 'Registrar receita' : 'Registrar despesa'}
          </button>
        </div>
      </div>
    </div>
  );
}
