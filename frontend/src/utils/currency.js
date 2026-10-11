const EXCHANGE_RATES = {
  USD: 1,
  KES: 129.5,
  GBP: 0.79,
  EUR: 0.92,
  NGN: 1520,
  ZAR: 18.2,
  UGX: 3890,
  TZS: 2590,
  GHS: 15.8,
  RWF: 1340,
  ETB: 56.5
};

export const COUNTRY_OPTIONS = [
  { label: 'Kenya', value: 'KE', currency: 'KES' },
  { label: 'Uganda', value: 'UG', currency: 'UGX' },
  { label: 'Tanzania', value: 'TZ', currency: 'TZS' },
  { label: 'Nigeria', value: 'NG', currency: 'NGN' },
  { label: 'South Africa', value: 'ZA', currency: 'ZAR' },
  { label: 'United Kingdom', value: 'GB', currency: 'GBP' },
  { label: 'United States', value: 'US', currency: 'USD' },
  { label: 'Europe', value: 'EU', currency: 'EUR' },
  { label: 'Ghana', value: 'GH', currency: 'GHS' },
  { label: 'Rwanda', value: 'RW', currency: 'RWF' },
  { label: 'Ethiopia', value: 'ET', currency: 'ETB' }
];

const COUNTRY_CURRENCY = {
  KE: 'KES',
  UG: 'UGX',
  TZ: 'TZS',
  NG: 'NGN',
  ZA: 'ZAR',
  GB: 'GBP',
  US: 'USD',
  EU: 'EUR',
  DE: 'EUR',
  FR: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  GH: 'GHS',
  RW: 'RWF',
  ET: 'ETB'
};

export function getBrowserLocale() {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }

  return 'en-KE';
}

export function resolveCurrencyFromLocale(locale = getBrowserLocale()) {
  const normalizedLocale = String(locale || '').toLowerCase();
  const countryCode = normalizedLocale.split('-')[1]?.toUpperCase();

  if (countryCode && COUNTRY_CURRENCY[countryCode]) {
    return COUNTRY_CURRENCY[countryCode];
  }

  if (normalizedLocale.includes('ke')) return 'KES';
  if (normalizedLocale.includes('ug')) return 'UGX';
  if (normalizedLocale.includes('tz')) return 'TZS';
  if (normalizedLocale.includes('ng')) return 'NGN';
  if (normalizedLocale.includes('za')) return 'ZAR';
  if (normalizedLocale.includes('gb')) return 'GBP';
  if (normalizedLocale.includes('us')) return 'USD';
  if (normalizedLocale.includes('de') || normalizedLocale.includes('fr') || normalizedLocale.includes('es') || normalizedLocale.includes('it')) return 'EUR';
  if (normalizedLocale.includes('gh')) return 'GHS';
  if (normalizedLocale.includes('rw')) return 'RWF';
  if (normalizedLocale.includes('et')) return 'ETB';

  return 'KES';
}

export function convertPriceToCurrency(amount, currencyCode = resolveCurrencyFromLocale()) {
  const numericAmount = Number(amount || 0);
  const baseCurrency = 'USD';
  const usdValue = numericAmount / (EXCHANGE_RATES[baseCurrency] || 1);
  const rate = EXCHANGE_RATES[currencyCode] || EXCHANGE_RATES.USD || 1;
  return usdValue * rate;
}

export function formatCurrency(amount, locale = getBrowserLocale(), currencyCode = resolveCurrencyFromLocale(locale)) {
  const value = convertPriceToCurrency(amount, currencyCode);

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: currencyCode === 'KES' || currencyCode === 'UGX' || currencyCode === 'TZS' || currencyCode === 'NGN' ? 0 : 2
    }).format(value);
  } catch (error) {
    return `${currencyCode} ${value.toFixed(currencyCode === 'KES' ? 0 : 2)}`;
  }
}
