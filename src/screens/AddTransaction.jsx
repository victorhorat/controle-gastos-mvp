import { useState } from 'react';
import { Icons } from '../components/Icons';
import { Card, CategoryIcon, ScreenHeader, HeaderIconBtn, FieldRow } from '../components/ui';
import { categories, sources } from '../data/appData';

export function AddTransaction({ onClose }) {
  const [kind, setKind] = useState('expense');
  const [cat, setCat] = useState('alim');
  const [src, setSrc] = useState('empresa');

  return (
    <div className="screen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 16 }}>
        <ScreenHeader
          large title="Nova transação"
          leading={<HeaderIconBtn onClick={onClose}><Icons.close size={18}/></HeaderIconBtn>}
          trailing={<HeaderIconBtn><Icons.more size={18}/></HeaderIconBtn>}
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

        {/* Amount input */}
        <div style={{ padding: '12px 20px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Valor</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 18, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>R$</span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 44, fontWeight: 600,
              letterSpacing: -1.5, fontVariantNumeric: 'tabular-nums',
              color: kind === 'income' ? 'var(--accent-strong)' : 'var(--text-1)',
            }}>86<span style={{ color: 'var(--text-3)' }}>,40</span></span>
          </div>
          <div style={{ marginTop: 8, height: 2, background: 'var(--accent)', width: 80, margin: '8px auto 0', borderRadius: 2 }}/>
        </div>

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Description */}
          <Card style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>Descrição</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{kind === 'income' ? 'Projeto landing — Arbor' : 'Restaurante Pomar'}</div>
          </Card>

          {/* Category / Source */}
          {kind === 'expense' ? (
            <Card style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>Categoria</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                {categories.slice(0, 9).map((c) => (
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Origem da renda</div>
                <button style={{ background: 'none', border: 'none', color: 'var(--accent-strong)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>+ Nova</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sources.slice(0, 4).map((s) => (
                  <button key={s.id} onClick={() => setSrc(s.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 12,
                    border: '1px solid ' + (src === s.id ? 'var(--accent)' : 'var(--border)'),
                    background: src === s.id ? 'color-mix(in oklab, var(--accent) 8%, var(--surface-1))' : 'var(--surface-1)',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 10,
                      background: 'var(--surface-2)', color: 'var(--text-1)',
                      display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0,
                    }}>{s.label[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{s.kind}{s.recurring ? ' · recorrente' : ''}</div>
                    </div>
                    {src === s.id && <Icons.check size={16} style={{ color: 'var(--accent)' }}/>}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Meta fields */}
          <Card style={{ padding: 0 }}>
            <FieldRow icon={<Icons.calendar size={16}/>} label="Data" value="Hoje · 13 mai"/>
            <FieldRow icon={<Icons.wallet size={16}/>} label={kind === 'income' ? 'Conta de destino' : 'Forma de pagamento'} value={kind === 'income' ? 'Nubank · principal' : 'PIX'}/>
            <FieldRow icon={<Icons.receipt size={16}/>} label="Comprovante" value="Anexar" muted last/>
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
