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

  const navigate = (to) => {
    setScreen(to);
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
      {screen === 'transactions' && <Transactions {...screenProps}/>}
      {screen === 'add'          && <AddTransaction {...screenProps}/>}
      {screen === 'patrimony'    && <Patrimony    {...screenProps}/>}
      {screen === 'reports'      && <Reports      {...screenProps}/>}
      {screen === 'calendar'     && <CalendarScreen {...screenProps}/>}
      {screen === 'sources'         && <Sources         {...screenProps}/>}
      {screen === 'categoryLimits' && <CategoryLimits  {...screenProps}/>}
      <BottomNav active={activeTab} onNavigate={navigate}/>
    </>
  );
}
