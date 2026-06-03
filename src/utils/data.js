function formatarDataBR(data) {
  const dataObjeto = new Date(data);
  if (isNaN(dataObjeto.getTime())) return "Data inválida";
  return new Intl.DateTimeFormat('pt-BR').format(dataObjeto);
}

function isDepois(dataInicio, dataFim) {
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);

  if (isNaN(inicio.getTime()) || !isNaN(fim.getTime()) === false) {
    return false;
  }

  return fim.getTime() > inicio.getTime();
}

module.exports = { formatarDataBR, isDepois }