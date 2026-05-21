export function formatCurrency(value: number, currency: string = 'USD', locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(value);
}
export function formatNumber(value: number, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale).format(value);
}
export function formatPercentage(value: number, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 2,
    }).format(value / 100);
}
