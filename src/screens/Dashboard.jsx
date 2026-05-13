import { useState } from 'react';
import { Icons } from '../components/Icons';
import { Card, Pill, Money, CategoryIcon, SectionTitle, ScreenHeader, HeaderIconBtn, Avatar } from '../components/ui';
import { DonutChart, LineChart } from '../components/charts';
import {
  BRL, BRLshort,
  categories, spending, transactions, investments, patrimonyHistory,
  totalIncome, totalSpend, monthlyGoal, annualGoal, totalIncomeAnnual, totalSpendAnnual,
  sources,
} from '../data/appData';

function TxnRow({ t, divider }) {
  const isIncome = t.type === 'income';
  const cat = !isIncome && categories.find((c) => c.id === t.cat);
  const src = isIncome && sources.find((s) => s.id === t.src);
  const dateLabel = new Date(t.date + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      borderBottom: divider ? '1px solid var(--border)' : 'none',
    }}>
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
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: isIncome ? 'var(--accent-strong)' : 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}>
        {isIncome ? '+' : '−'} {BRL(t.amount)}
      </div>
    </div>
  );
}

function GoalSheet({ goal, isYear, onSave, onClose }) {
  const [value, setValue] = useState(String(goal));

  const handleSave = () => {
    const parsed = parseFloat(value.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) onSave(parsed);
  };

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
        <div style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Meta de gastos</div>
        <div style={{ fontSize: 18, fontWeight: 650, marginBottom: 20 }}>{isYear ? 'Anual' : 'Mensal'}</div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Limite máximo (R$)</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--surface-2)', borderRadius: 14, padding: '14px 16px',
            border: '1.5px solid var(--accent)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-2)' }}>R$</span>
            <input
              autoFocus type="number" min="0" step="100"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onClose(); }}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600,
                color: 'var(--text-1)', width: '100%',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 14, borderRadius: 14, background: 'var(--surface-2)', border: 'none', fontSize: 14, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={handleSave} style={{ flex: 2, padding: 14, borderRadius: 14, background: 'var(--text-1)', border: 'none', fontSize: 14, fontWeight: 650, color: 'var(--surface-1)', cursor: 'pointer' }}>Salvar meta</button>
        </div>
      </div>
    </>
  );
}

export function Dashboard({ onNavigate }) {
  const [hide, setHide] = useState(false);
  const [period, setPeriod] = useState('month');
  const [editingGoal, setEditingGoal] = useState(false);
  const [customMonthlyGoal, setCustomMonthlyGoal] = useState(monthlyGoal);
  const [customAnnualGoal, setCustomAnnualGoal] = useState(annualGoal);

  const isYear = period === 'year';
  const income = isYear ? totalIncomeAnnual : totalIncome;
  const spend  = isYear ? totalSpendAnnual  : totalSpend;
  const goal   = isYear ? customAnnualGoal  : customMonthlyGoal;
  const flow   = income - spend;
  const pct    = Math.round(spend / income * 100);
  const pctOfGoal = Math.min(spend / goal, 1.25) * 100;

  const recent = transactions.slice(0, 4);
  const totalInvested = investments.reduce((s, x) => s + x.balance, 0);

  const saveGoal = (val) => {
    if (isYear) setCustomAnnualGoal(val);
    else setCustomMonthlyGoal(val);
    setEditingGoal(false);
  };

  return (
    <>
    <div className="screen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 16 }}>
        <ScreenHeader
          leading={
            <>
              <Avatar/>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Olá, Renata</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>13 de maio</div>
              </div>
            </>
          }
          trailing={
            <>
              <HeaderIconBtn><Icons.search size={18}/></HeaderIconBtn>
              <HeaderIconBtn><Icons.bell size={18}/></HeaderIconBtn>
            </>
          }
        />

        {/* Hero card */}
        <div style={{ padding: '0 16px' }}>
          <div className="cg-card cg-hero">
            <div style={{ display: 'inline-flex', padding: 3, gap: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 999, marginBottom: 14 }}>
              {[{ id: 'month', l: 'Mês' }, { id: 'year', l: 'Ano' }].map((p) => (
                <button key={p.id} onClick={() => setPeriod(p.id)} style={{
                  padding: '5px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: period === p.id ? '#fff' : 'transparent',
                  color: period === p.id ? 'var(--accent-strong)' : 'rgba(255,255,255,0.85)',
                  fontSize: 11, fontWeight: 650, letterSpacing: 0.2, fontFamily: 'var(--font-ui)', transition: 'all .15s',
                }}>{p.l}</button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  Sobrou em {isYear ? '2026' : 'maio'}
                </div>
                <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 650, letterSpacing: -0.8, fontVariantNumeric: 'tabular-nums' }}>
                  {hide ? 'R$ ••••••' : BRL(flow)}
                </div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>Receita − Despesa</div>
              </div>
              <button onClick={() => setHide(!hide)} style={{
                width: 32, height: 32, borderRadius: 10, border: 'none',
                background: 'rgba(255,255,255,0.16)', color: 'inherit',
                display: 'grid', placeItems: 'center', cursor: 'pointer',
              }}>{hide ? <Icons.eye_off size={16}/> : <Icons.eye size={16}/>}</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  <Icons.arrow_dn size={12} stroke={2}/> Receita
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                  {hide ? '••••' : BRL(income)}
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  <Icons.arrow_up size={12} stroke={2}/> Despesa
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
                  {hide ? '••••' : BRL(spend)}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.85, marginBottom: 6 }}>
                <span>{pct}% da receita usada</span>
                <button onClick={() => setEditingGoal(true)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'inherit', opacity: 1,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <Icons.pencil size={10}/>
                  meta {BRLshort(goal)}/{isYear ? 'ano' : 'mês'}
                </button>
              </div>
              <div style={{ height: 7, background: 'rgba(255,255,255,0.18)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  width: Math.min(pctOfGoal, 100) + '%', height: '100%',
                  background: spend > goal ? 'var(--coral)' : '#fff',
                  borderRadius: 999, transition: 'width .25s',
                }}/>
              </div>
            </div>
          </div>
        </div>


        {/* Insight strip */}
        <div style={{ padding: '0 16px' }}>
          <Card style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'color-mix(in oklab, var(--amber) 18%, transparent)', color: 'var(--amber-strong)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Icons.alert size={16}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Você já gastou 78% da renda</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>Alimentação está 13% acima do limite. Faltam 18 dias.</div>
            </div>
            <Icons.arrow_r size={16} style={{ color: 'var(--text-3)' }}/>
          </Card>
        </div>

        {/* Category donut */}
        <div style={{ padding: '0 16px' }}>
          <SectionTitle title="Onde vai seu dinheiro" action="Ver tudo" onAction={() => onNavigate('categoryLimits')}/>
          <Card style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <DonutChart
                data={spending.slice(0, 5).map((s) => {
                  const c = categories.find((x) => x.id === s.cat);
                  return { value: s.value, color: `oklch(0.62 0.14 ${c.hue})` };
                })}
                size={120} thickness={18} sub="Maio" label={BRLshort(totalSpend)}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {spending.slice(0, 4).map((s, i) => {
                  const c = categories.find((x) => x.id === s.cat);
                  const pct2 = Math.round(s.value / totalSpend * 100);
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: `oklch(0.62 0.14 ${c.hue})`, flexShrink: 0 }}/>
                      <div style={{ flex: 1, fontSize: 12 }}>{c.label}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>{pct2}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>

    {editingGoal && (
      <GoalSheet
        goal={goal}
        isYear={isYear}
        onSave={saveGoal}
        onClose={() => setEditingGoal(false)}
      />
    )}
    </>
  );
}
