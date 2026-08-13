export const PHONE_COUNTRY_CODES = [
  { code: '503', label: 'El Salvador', flag: '🇸🇻' },
  { code: '504', label: 'Honduras', flag: '🇭🇳' },
  { code: '502', label: 'Guatemala', flag: '🇬🇹' },
  { code: '1', label: 'Estados Unidos', flag: '🇺🇸' },
];

export const formatPhoneDisplay = (phoneNumber: string) => {
  const country = PHONE_COUNTRY_CODES.find((c) => phoneNumber.startsWith(c.code));
  if (!country) return phoneNumber;
  return `${country.flag} +${country.code} ${phoneNumber.slice(country.code.length)}`;
};

export const buildPhoneNumber = (countryCode: string, localNumber: string) => {
  const digits = localNumber?.replace(/\D/g, '') ?? '';
  return digits ? `${countryCode}${digits}` : '';
};
