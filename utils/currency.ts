const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatBRL = (value: number): string => brl.format(value);

/** Converte o texto digitado ("12345") em moeda, tratando os dígitos como centavos. */
export const maskBRLInput = (raw: string): string => formatBRL(Number(raw.replace(/\D/g, '')) / 100);

/** Converte "R$ 1.234,56" em 1234.56. */
export const parseBRL = (formatted: string): number => {
  const normalized = formatted.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(normalized);
};
