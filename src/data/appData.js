export const BRL = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

export const BRLshort = (v) => {
  const sign = v < 0 ? '-' : '';
  const abs = Math.abs(v);
  if (abs >= 1000) return sign + 'R$ ' + (abs / 1000).toFixed(abs >= 10000 ? 1 : 2).replace('.', ',') + 'k';
  return sign + 'R$ ' + abs.toFixed(0);
};

export const categories = [
  { id: 'alim',    label: 'Alimentação', hue: 22  },
  { id: 'trans',   label: 'Transporte',  hue: 200 },
  { id: 'assin',   label: 'Assinaturas', hue: 280 },
  { id: 'lazer',   label: 'Lazer',       hue: 340 },
  { id: 'saude',   label: 'Saúde',       hue: 140 },
  { id: 'edu',     label: 'Educação',    hue: 240 },
  { id: 'compras', label: 'Compras',     hue: 50  },
  { id: 'moradia', label: 'Moradia',     hue: 175 },
  { id: 'outros',  label: 'Outros',      hue: 0   },
];

export const sources = [
  { id: 'empresa',   label: 'Empresa Verth',        kind: 'Empresa',      recurring: true,  monthly: 6800 },
  { id: 'cliente-a', label: 'Cliente Arbor',         kind: 'Cliente',      recurring: true,  monthly: 1800 },
  { id: 'cliente-b', label: 'Cliente XPTO',          kind: 'Cliente',      recurring: false, monthly: 1200 },
  { id: 'pix-mae',   label: 'Ajuda da mãe',          kind: 'Família',      recurring: false, monthly: 400  },
  { id: 'invest',    label: 'Dividendos Banco',       kind: 'Investimento', recurring: true,  monthly: 280  },
  { id: 'venda',     label: 'Venda no Marketplace',  kind: 'Venda',        recurring: false, monthly: 180  },
];

export const spending = [
  { cat: 'moradia', value: 1850, plan: 2000 },
  { cat: 'alim',    value: 1240, plan: 1100 },
  { cat: 'trans',   value: 640,  plan: 700  },
  { cat: 'lazer',   value: 480,  plan: 400  },
  { cat: 'assin',   value: 312,  plan: 320  },
  { cat: 'saude',   value: 190,  plan: 300  },
  { cat: 'compras', value: 410,  plan: 350  },
  { cat: 'edu',     value: 220,  plan: 250  },
  { cat: 'outros',  value: 96,   plan: 200  },
];

export const dailySpend = [
  180, 0, 64, 120, 92, 0, 240,
  78, 35, 0, 158, 210, 96, 312,
  44, 0, 188, 122, 0, 86, 154,
  96, 220, 410, 76, 132, 0, 198,
  140, 88,
];

export const months = [
  { m: 'Jun', income: 8200, spend: 5640 },
  { m: 'Jul', income: 8400, spend: 6210 },
  { m: 'Ago', income: 7900, spend: 5780 },
  { m: 'Set', income: 9100, spend: 6890 },
  { m: 'Out', income: 8650, spend: 5980 },
  { m: 'Nov', income: 9480, spend: 5438 },
];

export const transactions = [
  { id: 't1',  type: 'expense', cat: 'alim',     desc: 'Restaurante Pomar',  amount: 86.40,   date: '2026-05-12', method: 'Crédito'  },
  { id: 't2',  type: 'expense', cat: 'trans',    desc: 'Uber — Centro',      amount: 23.80,   date: '2026-05-12', method: 'PIX'      },
  { id: 't3',  type: 'income',  src: 'empresa',  desc: 'Salário Maio',       amount: 6800.00, date: '2026-05-05', method: 'Transf.'  },
  { id: 't4',  type: 'expense', cat: 'assin',    desc: 'Streaming Música',   amount: 21.90,   date: '2026-05-04', method: 'Crédito'  },
  { id: 't5',  type: 'expense', cat: 'compras',  desc: 'Tênis novos',        amount: 389.00,  date: '2026-05-03', method: 'Crédito'  },
  { id: 't6',  type: 'expense', cat: 'moradia',  desc: 'Aluguel',            amount: 1850.00, date: '2026-05-02', method: 'Boleto'   },
  { id: 't7',  type: 'income',  src: 'cliente-a', desc: 'Projeto landing',   amount: 1800.00, date: '2026-05-01', method: 'PIX'      },
  { id: 't8',  type: 'expense', cat: 'lazer',    desc: 'Show no Sesc',       amount: 120.00,  date: '2026-04-29', method: 'Débito'   },
  { id: 't9',  type: 'expense', cat: 'saude',    desc: 'Farmácia',           amount: 64.20,   date: '2026-04-28', method: 'Débito'   },
  { id: 't10', type: 'income',  src: 'pix-mae',  desc: 'PIX da mãe',         amount: 400.00,  date: '2026-04-27', method: 'PIX'      },
];

export const investments = [
  { id: 'c1', label: 'Conta Nubank',        inst: 'Nubank',   kind: 'Conta',    balance: 8420, growth: null,  purpose: null,                    maturity: null,         history: [7200,7400,7800,8100,8200,8420] },
  { id: 'c2', label: 'Conta Itaú',          inst: 'Itaú',     kind: 'Conta',    balance: 5908, growth: null,  purpose: null,                    maturity: null,         history: [5400,5500,5650,5700,5820,5908] },
  { id: 'i1', label: 'Caixinha Reserva',    inst: 'Nubank',   kind: 'Caixinha', balance: 7850, growth: 0.011, purpose: 'Reserva de emergência', maturity: null,         history: [5800,6100,6450,6900,7350,7850] },
  { id: 'i2', label: 'CDB 110% CDI',        inst: 'PicPay',   kind: 'CDB',      balance: 4200, growth: 0.013, purpose: 'Trocar de carro',       maturity: '2027-08-15', history: [2400,2820,3180,3500,3850,4200] },
  { id: 'i3', label: 'Caixinha Viagem',     inst: 'Nubank',   kind: 'Caixinha', balance: 1980, growth: 0.010, purpose: 'Viagem Chapada',        maturity: null,         history: [800,1050,1300,1500,1740,1980] },
  { id: 'i4', label: 'Poupança',            inst: 'Itaú',     kind: 'Poupança', balance: 1240, growth: 0.006, purpose: null,                    maturity: null,         history: [1180,1190,1200,1215,1228,1240] },
  { id: 'i5', label: 'Tesouro Selic 2029',  inst: 'Nuinvest', kind: 'Tesouro',  balance: 3500, growth: 0.012, purpose: null,                    maturity: '2029-03-01', history: [3200,3260,3320,3380,3440,3500] },
  { id: 'i6', label: 'CDB Liquidez Diária', inst: 'PicPay',   kind: 'CDB',      balance: 2180, growth: 0.011, purpose: null,                    maturity: '2026-11-20', history: [1700,1820,1920,2000,2090,2180] },
];

export const historyMonths = ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai'];

export const patrimonyHistory = [
  14200, 14860, 15310, 15980, 16420, 17100,
  17580, 18240, 18820, 19340, 19770, 20950,
];

export const recurring = [
  { label: 'Aluguel',          cat: 'moradia', amount: 1850,  day: 5,  next: '05/jun' },
  { label: 'Internet Fibra',   cat: 'moradia', amount: 119,   day: 10, next: '10/jun' },
  { label: 'Streaming Filmes', cat: 'assin',   amount: 39.90, day: 12, next: '12/mai' },
  { label: 'Academia',         cat: 'saude',   amount: 89,    day: 15, next: '15/mai' },
  { label: 'Streaming Música', cat: 'assin',   amount: 21.90, day: 18, next: '18/mai' },
  { label: 'iCloud+',          cat: 'assin',   amount: 12.90, day: 22, next: '22/mai' },
];

export const insights = [
  { tone: 'warn', title: 'Alimentação acima do plano',       body: 'Você gastou R$ 1.240 — 13% acima do limite de R$ 1.100. Faltam 18 dias no mês.' },
  { tone: 'info', title: 'Maior fonte de renda: Empresa Verth', body: 'Representou 67% das suas entradas em maio.' },
  { tone: 'good', title: 'Economia de R$ 542 em transporte', body: 'Você gastou 23% menos que abril com Uber e combustível.' },
  { tone: 'warn', title: 'Assinatura raramente usada',        body: 'Detectamos que iCloud+ é cobrado, mas o uso caiu 80% em 60 dias.' },
];

export const totalIncome = sources.reduce((s, x) => s + x.monthly, 0);
export const totalSpend  = spending.reduce((s, x) => s + x.value, 0);
export const monthlyGoal = 7500;
export const annualGoal  = 72000;
export const totalIncomeAnnual = 102400;
export const totalSpendAnnual  = 58320;
