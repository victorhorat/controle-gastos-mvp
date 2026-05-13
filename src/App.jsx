import { useState } from 'react';
import { Icons } from './components/Icons';
import { Dashboard } from './screens/Dashboard';
import { Transactions } from './screens/Transactions';
import { AddTransaction } from './screens/AddTransaction';
import { Patrimony } from './screens/Patrimony';
import { Reports } from './screens/Reports';
import { CalendarScreen } from './screens/CalendarScreen';
import { Sources } from './screens/Sources';
import { CategoryLimits } from './screens/CategoryLimits';
import { Subscriptions } from './screens/Subscriptions';
import { HousingBills } from './screens/HousingBills';
import { initialSubscriptions, initialHousingBills, transactions as initialTransactions } from './data/appData';

const NAV_TABS = [
  { id: 'dashboard',    label: 'Início',      Icon: (p) => <Icons.home    {...p}/> },
  { id: 'transactions', label: 'Transações',  Icon: (p) => <Icons.list    {...p}/> },
  { id: 'add',          label: 'Adicionar',   Icon: (p) => <Icons.plus    {...p}/>, isAdd: true },
  { id: 'reports',      label: 'Relatórios',  Icon: (p) => <Icons.chart   {...p}/> },
  { id: 'patrimony',    label: 'Patrimônio',  Icon: (p) => <Icons.wallet  {...p}/> },
];

function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottom-nav">
      {NAV_TABS.map((tab) => {
        if (tab.isAdd) {
          return (
            <button key={tab.id} className="nav-item-add" onClick={() => onNavigate('add')}>
              <div className="nav-add-btn">
                <tab.Icon size={20}/>
              </div>
              <span>{tab.label}</span>
            </button>
          );
        }
        return (
          <button
            key={tab.id}
            className={'nav-item' + (active === tab.id ? ' active' : '')}
            onClick={() => onNavigate(tab.id)}
          >
            <tab.Icon size={22}/>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [history, setHistory] = useState(['dashboard']);
  const [navParams, setNavParams] = useState({});
  const [subs, setSubs] = useState(initialSubscriptions);
  const [housingBills, setHousingBills] = useState(initialHousingBills);
  const [txns, setTxns] = useState(initialTransactions);

  const addTxn = (txn) => setTxns((prev) => {
    const idx = prev.findIndex((t) => t.id === txn.id);
    return idx >= 0 ? prev.map((t) => t.id === txn.id ? txn : t) : [txn, ...prev];
  });

  const addHousingBill = (bill) => setHousingBills((prev) => [...prev, bill]);

  const deleteHousingBill = (id) => {
    setHousingBills((prev) => prev.filter((b) => b.id !== id));
    setTxns((prev) => prev.filter((t) => !t.billId?.startsWith(id)));
  };

  const logHousingAmount = (bill, month, amount) => {
    setHousingBills((prev) => prev.map((b) => {
      if (b.id !== bill.id) return b;
      const history = b.history.filter((h) => h.month !== month);
      return { ...b, history: [...history, { month, amount }].sort((a, z) => a.month.localeCompare(z.month)) };
    }));
    addTxn({
      id:     `txn-hb-${bill.id}-${month}`,
      type:   'expense',
      cat:    'moradia',
      billId: `${bill.id}-${month}`,
      desc:   bill.type,
      amount,
      date:   `${month}-05`,
      method: 'Débito',
    });
  };

  const addSub = (sub) => {
    setSubs((prev) => {
      const idx = prev.findIndex((s) => s.id === sub.id);
      return idx >= 0 ? prev.map((s) => s.id === sub.id ? sub : s) : [...prev, sub];
    });
  };
  const deleteSub = (id) => {
    setSubs((prev) => prev.filter((s) => s.id !== id));
    setTxns((prev) => prev.filter((t) => t.subId !== id));
  };
  const navigate = (to, params = {}) => {
    setScreen(to);
    setNavParams(params);
    setHistory((h) => [...h, to]);
  };

  const goBack = () => {
    if (history.length <= 1) return setScreen('dashboard');
    const prev = history[history.length - 2];
    setHistory((h) => h.slice(0, -1));
    setScreen(prev);
  };

  const mainScreens = ['dashboard', 'transactions', 'reports', 'patrimony', 'calendar', 'sources'];
  const activeTab = mainScreens.includes(screen) ? screen : null;

  const screenProps = { onNavigate: navigate, onBack: goBack, onClose: goBack };

  return (
    <>
      {screen === 'dashboard'    && <Dashboard    {...screenProps}/>}
      {screen === 'transactions' && <Transactions {...screenProps} initialCatFilter={navParams.catFilter} initialMonthFilter={navParams.monthFilter} subs={subs} txns={txns} onTxnsChange={setTxns}/>}
      {screen === 'add'          && <AddTransaction {...screenProps}/>}
      {screen === 'patrimony'    && <Patrimony    {...screenProps}/>}
      {screen === 'reports'      && <Reports      {...screenProps} txns={txns}/>}
      {screen === 'calendar'     && <CalendarScreen {...screenProps}/>}
      {screen === 'sources'         && <Sources         {...screenProps}/>}
      {screen === 'categoryLimits'  && <CategoryLimits  {...screenProps}/>}
      {screen === 'subscriptions'   && <Subscriptions   {...screenProps} subs={subs} onAddSub={addSub} onDeleteSub={deleteSub} onAddTxn={addTxn}/>}
      {screen === 'housingBills'    && <HousingBills    {...screenProps} bills={housingBills} onLogAmount={logHousingAmount} onDeleteBill={deleteHousingBill} onAddBill={addHousingBill}/>}
      <BottomNav active={activeTab} onNavigate={navigate}/>
    </>
  );
}
