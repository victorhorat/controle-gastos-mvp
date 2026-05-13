const Icon = ({ d, size = 22, stroke = 1.6, fill = 'none', children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
       stroke="currentColor" strokeWidth={stroke}
       strokeLinecap="round" strokeLinejoin="round" style={style}>
    {d ? <path d={d}/> : children}
  </svg>
);

export const Icons = {
  home:     (p) => <Icon {...p}><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/><path d="M10 20v-5h4v5"/></Icon>,
  list:     (p) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h10"/></Icon>,
  plus:     (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>,
  chart:    (p) => <Icon {...p}><path d="M4 20h16"/><path d="M7 16V9M12 16V5M17 16v-7"/></Icon>,
  bell:     (p) => <Icon {...p}><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.5h-15Z"/><path d="M10 21a2 2 0 0 0 4 0"/></Icon>,
  calendar: (p) => <Icon {...p}><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></Icon>,
  search:   (p) => <Icon {...p}><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></Icon>,
  filter:   (p) => <Icon {...p}><path d="M4 5h16l-6 8v6l-4-2v-4z"/></Icon>,
  arrow_up: (p) => <Icon {...p}><path d="M12 19V5M6 11l6-6 6 6"/></Icon>,
  arrow_dn: (p) => <Icon {...p}><path d="M12 5v14M6 13l6 6 6-6"/></Icon>,
  arrow_r:  (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>,
  back:     (p) => <Icon {...p}><path d="M19 12H5M11 18l-6-6 6-6"/></Icon>,
  more:     (p) => <Icon {...p}><circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/></Icon>,
  close:    (p) => <Icon {...p}><path d="M6 6l12 12M18 6 6 18"/></Icon>,
  spark:    (p) => <Icon {...p}><path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M6.3 17.7l2.8-2.8M14.9 9.1l2.8-2.8"/></Icon>,
  alert:    (p) => <Icon {...p}><path d="M12 4 3 20h18z"/><path d="M12 10v4M12 17v.5" strokeWidth={1.8}/></Icon>,
  check:    (p) => <Icon {...p}><path d="M5 12.5 10 17 19 7"/></Icon>,
  upload:   (p) => <Icon {...p}><path d="M12 16V4M6 10l6-6 6 6"/><path d="M5 20h14"/></Icon>,
  wallet:   (p) => <Icon {...p}><path d="M4 7c0-1.7 1.3-3 3-3h10v4"/><rect x="3" y="7" width="18" height="13" rx="2.5"/><circle cx="17" cy="13.5" r="1.3" fill="currentColor"/></Icon>,
  eye:      (p) => <Icon {...p}><path d="M2 12c2.5-4.5 6-7 10-7s7.5 2.5 10 7c-2.5 4.5-6 7-10 7s-7.5-2.5-10-7z"/><circle cx="12" cy="12" r="2.7"/></Icon>,
  eye_off:  (p) => <Icon {...p}><path d="M3 3l18 18"/><path d="M10.6 6.2A10 10 0 0 1 12 6c4 0 7.5 2.5 10 7-1 1.8-2.2 3.3-3.6 4.4M6.6 7.6C4.6 9 3 10.7 2 12c2.5 4.5 6 7 10 7 1.6 0 3-.4 4.3-1"/><path d="M9.7 10.6a3 3 0 0 0 4 4"/></Icon>,
  receipt:  (p) => <Icon {...p}><path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21z"/><path d="M9 8h6M9 12h6M9 16h3"/></Icon>,
  pencil:   (p) => <Icon {...p}><path d="m4 20 4-1 11-11-3-3L5 16z"/></Icon>,
  trash:    (p) => <Icon {...p}><path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></Icon>,
};
