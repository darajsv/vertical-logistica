export const formatDate = (dateStr: string): string => {
  if (dateStr.length !== 8) {
    throw new Error('Formato de data inválido. Esperado AAAAMMDD.');
  }

  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  return `${year}-${month}-${day}`;
};
