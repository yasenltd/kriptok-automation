export const formatNumber = (
  value: number,
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
) => {
  return new Intl.NumberFormat(locale, options).format(value);
};
