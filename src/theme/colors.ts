/**
 * لوحة التطبيق: خلفية سليت عميقة + كهرماني للتمييز (مطابقة واجهات الصور).
 */
export const colors = {
  background: '#0f172a',
  backgroundElevated: '#121826',
  surfaceDeep: '#0f172a',
  surfaceMid: '#1e293b',

  border: '#1e293b',
  borderMuted: '#334155',

  /** زر أساسي / تبويب نشط */
  primary: '#f59e0b',
  onPrimary: '#0f172a',

  text: '#f8fafc',
  textSecondary: '#e2e8f0',
  textMuted: '#94a3b8',
  placeholder: '#64748b',
  textSubtle: '#cbd5e1',

  /** روابط وأزرار ثانوية (مراسلة، إلغاء) */
  link: '#3b82f6',
  accentIndigo: '#a5b4fc',

  /** بنيان AI — بنفسجي */
  aiPurple: '#8b5cf6',
  onAiPurple: '#ffffff',

  /** أرقام إيجابية / إيرادات */
  success: '#34d399',

  /** أرقام في التقارير (سماوي) */
  reportValue: '#38bdf8',

  card: 'rgba(30,41,59,0.92)',
  cardSoft: 'rgba(30,41,59,0.75)',
  chipBg: '#1e293b',
  primaryTint12: 'rgba(245,158,11,0.14)',
  primaryTint18: 'rgba(245,158,11,0.22)',
  walletInner: 'rgba(15,23,42,0.95)',
  walletBorderGlow: 'rgba(245,158,11,0.28)',

  error: '#fb7185',
  danger: '#ef4444',
  warning: '#fb923c',
  notification: '#f97316',

  dangerBorder: '#7f1d1d',
  dangerBg: 'rgba(127,29,29,0.15)',
  dangerText: '#fca5a5',

  tabBar: '#0b1120',
} as const;

export const gradients = {
  login: [colors.background, colors.backgroundElevated] as const,
  walletCard: [colors.surfaceDeep, '#1e293b'] as const,
} as const;

export type ColorKey = keyof typeof colors;
