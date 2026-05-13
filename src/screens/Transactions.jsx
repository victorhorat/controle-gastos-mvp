import { useState, useMemo, useRef } from 'react';
import { Icons } from '../components/Icons';
import { Card, CategoryIcon, ScreenHeader, HeaderIconBtn } from '../components/ui';
import { BRL, BRLshort, categories, sources, transactions as initialTransactions } from '../data/appData';

const METHODS = ['PIX', 'Crédito', 'Débito', 'Transferência', 'Boleto', 'Dinheiro'];

function EditSheet({ t, onSave, onClose }) {
  const [kind,   setKind]   = useState(t.type);
  const [amount, setAmount] = useState(String(t.amount).replace('.', ','));
  const [desc,   setDesc]   = useState(t.desc);
  const [cat,    setCat]    = useState(t.cat   ?? 'alim');
  const [src,    setSrc]    = useState(t.src   ?? 'empresa');
  const [date,   setDate]   = useState(t.date);
  const [method, setMethod] = useState(t.method);

  const handleSave = () => {
    const parsed = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0 || !desc.trim()) return;
    onSave({
      ...t,
      type:   kind,
      amount: parsed,
      desc:   desc.trim(),
      cat:    kind === 'expense' ? cat : undefined,
      src:    kind === 'income'  ? src : undefined,
      date,
      method,
    });
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, backdropFilter: 'blur(2px)' }}/>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--surface-1)', borderRadius: '24px 24px 0 0',
        padding: '12px 20px 40px', zIndex: 201,
        boxShadow: '0 -4px 32px rgba(0,0,0,0.14)',
        maxHeight: '92%', overflowY: 'auto',
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--surface-3)', margin: '0 auto 20px' }}/>

        <div style={{ fontSize: 18, fontWeight: 650, marginBottom: 20 }}>Editar transação</div>

        {/* Type toggle */}
        <div style={{ display: 'flex', padding: 4, background: 'var(--surface-2)', borderRadius: 14, gap: 3, marginBottom: 16 }}>
          {[{ id: 'expense', l: 'Despesa' }, { id: 'income', l: 'Receita' }].map((s) => (
            <button key={s.id} onClick={() => setKind(s.id)} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: kind === s.id ? (s.id === 'income' ? 'var(--accent)' : 'var(--coral)') : 'transparent',
              color: kind === s.id ? '#fff' : 'var(--text-2)',
              fontSize: 13, fontWeight: 600, transition: 'all .15s',
            }}>{s.l}</button>
          ))}
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
              autoFocus type="text" inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600,
                color: 'var(--text-1)',
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Descrição</div>
          <input
            type="text" value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--surface-2)', border: '1.5px solid var(--border)',
              borderRadius: 14, padding: '14px 16px',
              fontSize: 14, fontWeight: 500, color: 'var(--text-1)', outline: 'none',
            }}
          />
        </div>

        {/* Category / Source */}
        {kind === 'expense' ? (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>Categoria</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {categories.map((c) => (
                <button key={c.id} onClick={() => setCat(c.id)} style={{
                  background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <div style={{
                    padding: 2, borderRadius: 14,
                    outline: cat === c.id ? '2px solid var(--accent)' : '2px solid transparent',
                    transition: 'outline .15s',
                  }}>
                    <CategoryIcon cat={c.id} size={36}/>
                  </div>
                  <div style={{ fontSize: 9, color: cat === c.id ? 'var(--text-1)' : 'var(--text-2)', fontWeight: cat === c.id ? 600 : 500 }}>{c.label}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>Origem</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sources.map((s) => (
                <button key={s.id} onClick={() => setSrc(s.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 12,
                  border: '1px solid ' + (src === s.id ? 'var(--accent)' : 'var(--border)'),
                  background: src === s.id ? 'color-mix(in oklab, var(--accent) 8%, var(--surface-1))' : 'var(--surface-1)',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 10,
                    background: 'var(--surface-2)', display: 'grid', placeItems: 'center',
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>{s.label[0]}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                  {src === s.id && <Icons.check size={16} style={{ color: 'var(--accent)' }}/>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Data</div>
          <input
            type="date" value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--surface-2)', border: '1.5px solid var(--border)',
              borderRadius: 14, padding: '14px 16px',
              fontSize: 14, color: 'var(--text-1)', outline: 'none',
            }}
          />
        </div>

        {/* Method */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>Forma de pagamento</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {METHODS.map((m) => (
              <button key={m} onClick={() => setMethod(m)} style={{
                padding: '8px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: method === m ? 'var(--accent)' : 'var(--surface-2)',
                color: method === m ? '#fff' : 'var(--text-2)',
                fontSize: 12, fontWeight: 600, transition: 'all .15s',
              }}>{m}</button>
            ))}
          </div>
        </div>

        {/* Buttons */}
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
          }}>Salvar</button>
        </div>
      </div>
    </>
  );
}

const PERIOD_OPTIONS = [
  { id: '1',   label: 'Este mês',        months: 1  },
  { id: '3',   label: 'Últimos 3 meses', months: 3  },
  { id: '6',   label: 'Últimos 6 meses', months: 6  },
  { id: '12',  label: 'Último ano',      months: 12 },
  { id: 'all', label: 'Tudo',            months: 0  },
];

const ACTION_W = 130; // largura total das ações reveladas

function filterByPeriod(txns, months) {
  if (months === 0) return txns;
  const cutoff = new Date('2026-05-13');
  cutoff.setMonth(cutoff.getMonth() - months);
  return txns.filter((t) => new Date(t.date + 'T12:00') >= cutoff);
}

function PeriodSheet({ current, onSelect, onClose }) {
  const [selected, setSelected] = useState(current);
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, backdropFilter: 'blur(2px)' }}/>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--surface-1)', borderRadius: '24px 24px 0 0',
        padding: '12px 20px 40px', zIndex: 201,
        boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--surface-3)', margin: '0 auto 20px' }}/>
        <div style={{ fontSize: 18, fontWeight: 650, marginBottom: 16 }}>Filtrar por período</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {PERIOD_OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <button key={opt.id} onClick={() => setSelected(opt.id)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: 14,
                border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border)'),
                background: active ? 'color-mix(in oklab, var(--accent) 8%, var(--surface-1))' : 'var(--surface-1)',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{opt.label}</span>
                {active && <Icons.check size={16} style={{ color: 'var(--accent)' }}/>}
              </button>
            );
          })}
        </div>
        <button onClick={() => { onSelect(selected); onClose(); }} style={{
          width: '100%', padding: 16, borderRadius: 16,
          background: 'var(--text-1)', border: 'none',
          fontSize: 15, fontWeight: 650, color: 'var(--surface-1)', cursor: 'pointer',
        }}>Aplicar filtro</button>
      </div>
    </>
  );
}

function CatFilterSheet({ availableCats, current, onSelect, onClose }) {
  const [selected, setSelected] = useState(current);

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, backdropFilter: 'blur(2px)' }}/>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'var(--surface-1)', borderRadius: '24px 24px 0 0',
        padding: '12px 20px 40px', zIndex: 201,
        boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
        maxHeight: '80%', overflowY: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--surface-3)', margin: '0 auto 20px' }}/>
        <div style={{ fontSize: 18, fontWeight: 650, marginBottom: 16 }}>Filtrar por categoria</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {/* All option */}
          {[{ id: 'all', label: 'Todas', isCat: false }]
            .concat(availableCats.map((id) => {
              const cat = categories.find((c) => c.id === id);
              const src = !cat && sources.find((s) => s.id === id);
              return { id, label: cat ? cat.label : src?.label ?? id, isCat: !!cat };
            }))
            .map(({ id, label, isCat }) => {
              const active = selected === id;
              return (
                <button key={id} onClick={() => setSelected(id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 14,
                  border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border)'),
                  background: active ? 'color-mix(in oklab, var(--accent) 8%, var(--surface-1))' : 'var(--surface-1)',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  {id === 'all' ? (
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--surface-2)', display: 'grid', placeItems: 'center' }}>
                      <Icons.list size={16}/>
                    </div>
                  ) : isCat ? <CategoryIcon cat={id} size={36}/> : (
                    <div style={{
                      width: 36, height: 36, borderRadius: 12,
                      background: 'color-mix(in oklab, var(--accent) 16%, transparent)',
                      color: 'var(--accent-strong)', display: 'grid', placeItems: 'center',
                      fontSize: 13, fontWeight: 700,
                    }}>{label[0]}</div>
                  )}
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', flex: 1 }}>{label}</span>
                  {active && <Icons.check size={16} style={{ color: 'var(--accent)' }}/>}
                </button>
              );
            })}
        </div>

        <button onClick={() => { onSelect(selected); onClose(); }} style={{
          width: '100%', padding: 16, borderRadius: 16,
          background: 'var(--text-1)', border: 'none',
          fontSize: 15, fontWeight: 650, color: 'var(--surface-1)', cursor: 'pointer',
        }}>Aplicar filtro</button>
      </div>
    </>
  );
}

function SwipeableRow({ t, divider, onEdit, onDelete }) {
  const isIncome = t.type === 'income';
  const cat = !isIncome && categories.find((c) => c.id === t.cat);
  const src = isIncome && sources.find((s) => s.id === t.src);
  const dateLabel = new Date(t.date + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const startX = useRef(null);
  const startOffset = useRef(0);
  const dragging = useRef(false);

  const beginDrag = (clientX) => {
    startX.current = clientX;
    startOffset.current = offset;
    dragging.current = true;
  };

  const moveDrag = (clientX) => {
    if (!dragging.current || startX.current === null) return;
    const dx = clientX - startX.current;
    const next = Math.min(0, Math.max(-ACTION_W, startOffset.current + dx));
    setOffset(next);
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    startX.current = null;
    if (offset < -ACTION_W / 2) {
      setOffset(-ACTION_W);
      setOpen(true);
    } else {
      setOffset(0);
      setOpen(false);
    }
  };

  const onTouchStart = (e) => beginDrag(e.touches[0].clientX);
  const onTouchMove  = (e) => moveDrag(e.touches[0].clientX);
  const onTouchEnd   = () => endDrag();

  const onMouseDown  = (e) => beginDrag(e.clientX);
  const onMouseMove  = (e) => moveDrag(e.clientX);
  const onMouseUp    = () => endDrag();
  const onMouseLeave = () => endDrag();

  const close = () => { setOffset(0); setOpen(false); dragging.current = false; };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderBottom: divider ? '1px solid var(--border)' : 'none' }}>

      {/* Action buttons revealed underneath */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        display: 'flex', width: ACTION_W,
      }}>
        <button onClick={() => { close(); onEdit(t); }} style={{
          flex: 1, border: 'none', cursor: 'pointer',
          background: 'color-mix(in oklab, var(--accent) 85%, black)',
          color: '#fff', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <Icons.pencil size={18}/>
          <span style={{ fontSize: 10, fontWeight: 600 }}>Editar</span>
        </button>
        <button onClick={() => { close(); onDelete(t.id); }} style={{
          flex: 1, border: 'none', cursor: 'pointer',
          background: 'var(--coral)',
          color: '#fff', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <Icons.trash size={18}/>
          <span style={{ fontSize: 10, fontWeight: 600 }}>Excluir</span>
        </button>
      </div>

      {/* Row content */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{ userSelect: 'none',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px',
          background: 'var(--surface-1)',
          transform: `translateX(${offset}px)`,
          transition: dragging.current ? 'none' : 'transform .25s cubic-bezier(0.4,0,0.2,1)',
          position: 'relative', zIndex: 1,
        }}
      >
        {isIncome ? (
          <div style={{ width: 36, height: 36, borderRadius: 12, background: 'color-mix(in oklab, var(--accent) 16%, transparent)', color: 'var(--accent-strong)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <Icons.arrow_dn size={16} stroke={2}/>
          </div>
        ) : <CategoryIcon cat={t.cat} size={36}/>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 550, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.desc}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2, display: 'flex', gap: 6 }}>
            <span>{isIncome ? src?.label : cat?.label}</span>
            <span>·</span>
            <span>{dateLabel}</span>
            <span>·</span>
            <span>{t.method}</span>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: isIncome ? 'var(--accent-strong)' : 'var(--coral-strong)', fontVariantNumeric: 'tabular-nums' }}>
          {isIncome ? '+' : '−'} {BRL(t.amount)}
        </div>
      </div>
    </div>
  );
}

export function Transactions({ onBack }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [catFilter,  setCatFilter]  = useState('all');
  const [periodId, setPeriodId] = useState('1');
  const [showPeriodSheet, setShowPeriodSheet] = useState(false);
  const [showCatSheet, setShowCatSheet] = useState(false);
  const [txns, setTxns] = useState(initialTransactions);
  const [editingTxn, setEditingTxn] = useState(null);

  const periodMonths = PERIOD_OPTIONS.find((o) => o.id === periodId)?.months ?? 1;
  const periodLabel  = PERIOD_OPTIONS.find((o) => o.id === periodId)?.label ?? 'Este mês';

  const catLabel = (() => {
    if (catFilter === 'all') return 'Categoria';
    const cat = categories.find((c) => c.id === catFilter);
    if (cat) return cat.label;
    const src = sources.find((s) => s.id === catFilter);
    return src?.label ?? catFilter;
  })();

  const byPeriod   = useMemo(() => filterByPeriod(txns, periodMonths), [txns, periodMonths]);
  const byType     = useMemo(() => byPeriod.filter((t) => typeFilter === 'all' || t.type === typeFilter), [byPeriod, typeFilter]);
  const filtered   = useMemo(() => byType.filter((t) => {
    if (catFilter === 'all') return true;
    return t.cat === catFilter || t.src === catFilter;
  }), [byType, catFilter]);

  // categorias/origens que aparecem nas transações filtradas por tipo
  const availableCats = useMemo(() => {
    const seen = new Set();
    byType.forEach((t) => { if (t.cat) seen.add(t.cat); if (t.src) seen.add(t.src); });
    return [...seen];
  }, [byType]);

  // reset cat filter quando troca tipo
  const handleTypeFilter = (v) => { setTypeFilter(v); setCatFilter('all'); };

  const totalIn  = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const groups = useMemo(() => {
    const m = {};
    filtered.forEach((t) => { (m[t.date] ||= []).push(t); });
    return Object.entries(m).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const handleDelete = (id) => setTxns((prev) => prev.filter((t) => t.id !== id));
  const handleEdit   = (t) => setEditingTxn(t);
  const handleSaveEdit = (updated) => {
    setTxns((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    setEditingTxn(null);
  };

  return (
    <>
      <div className="screen">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16 }}>
          <ScreenHeader
            large title="Transações"
            leading={<HeaderIconBtn onClick={onBack}><Icons.back size={18}/></HeaderIconBtn>}
            trailing={
              <>
                <HeaderIconBtn><Icons.search size={18}/></HeaderIconBtn>
                <HeaderIconBtn onClick={() => setShowPeriodSheet(true)}>
                  <Icons.filter size={18} style={{ color: periodId !== 'all' ? 'var(--accent-strong)' : undefined }}/>
                </HeaderIconBtn>
              </>
            }
          />

          {/* Período e categoria */}
          <div style={{ padding: '0 20px', display: 'flex', gap: 8 }}>
            <button onClick={() => setShowPeriodSheet(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 999,
              background: 'var(--surface-2)', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: 'var(--text-2)',
            }}>
              <Icons.calendar size={13}/>
              {periodLabel}
              <Icons.arrow_dn size={12}/>
            </button>
            <button onClick={() => setShowCatSheet(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 999,
              background: catFilter !== 'all' ? 'color-mix(in oklab, var(--accent) 12%, var(--surface-2))' : 'var(--surface-2)',
              border: catFilter !== 'all' ? '1px solid var(--accent)' : '1px solid transparent',
              cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
              color: catFilter !== 'all' ? 'var(--accent-strong)' : 'var(--text-2)',
            }}>
              <Icons.filter size={13}/>
              {catLabel}
              <Icons.arrow_dn size={12}/>
            </button>
          </div>

          {/* Summary bar */}
          <div style={{ padding: '0 16px' }}>
            <Card style={{ padding: 14, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Entradas</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--accent-strong)', marginTop: 4 }}>+ {BRLshort(totalIn)}</div>
              </div>
              <div style={{ width: 1, height: 32, background: 'var(--border)' }}/>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Saídas</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--coral-strong)', marginTop: 4 }}>− {BRLshort(totalOut)}</div>
              </div>
              <div style={{ width: 1, height: 32, background: 'var(--border)' }}/>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Saldo</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, marginTop: 4 }}>{BRLshort(totalIn - totalOut)}</div>
              </div>
            </Card>
          </div>

          {/* Filter tabs */}
          <div style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', padding: 4, background: 'var(--surface-2)', borderRadius: 14, gap: 2 }}>
              {[{ id: 'all', l: 'Tudo' }, { id: 'expense', l: 'Despesas' }, { id: 'income', l: 'Receitas' }].map((s) => (
                <button key={s.id} onClick={() => handleTypeFilter(s.id)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: typeFilter === s.id ? 'var(--surface-1)' : 'transparent',
                  color: typeFilter === s.id ? 'var(--text-1)' : 'var(--text-2)',
                  fontSize: 12, fontWeight: 600,
                  boxShadow: typeFilter === s.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all .15s',
                }}>{s.l}</button>
              ))}
            </div>
          </div>

          {/* Date groups */}
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {groups.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)', fontSize: 14 }}>
                Nenhuma transação neste período
              </div>
            )}
            {groups.map(([date, items]) => {
              const dayTotal = items.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);
              const dLabel = new Date(date + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
              return (
                <div key={date}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px 8px', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>{dLabel}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)' }}>
                      {dayTotal >= 0 ? '+' : '−'} {BRLshort(Math.abs(dayTotal))}
                    </span>
                  </div>
                  <Card style={{ padding: 0 }}>
                    {items.map((t, i) => (
                      <SwipeableRow
                        key={t.id} t={t}
                        divider={i < items.length - 1}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showPeriodSheet && (
        <PeriodSheet
          current={periodId}
          onSelect={setPeriodId}
          onClose={() => setShowPeriodSheet(false)}
        />
      )}

      {showCatSheet && (
        <CatFilterSheet
          availableCats={availableCats}
          current={catFilter}
          onSelect={setCatFilter}
          onClose={() => setShowCatSheet(false)}
        />
      )}

      {editingTxn && (
        <EditSheet
          t={editingTxn}
          onSave={handleSaveEdit}
          onClose={() => setEditingTxn(null)}
        />
      )}
    </>
  );
}
