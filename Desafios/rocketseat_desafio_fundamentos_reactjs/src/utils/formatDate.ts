const formatDate = (value: Date): string =>
  new Intl.DateTimeFormat('pt-BR').format(new Date(value)).toString();
export default formatDate;
