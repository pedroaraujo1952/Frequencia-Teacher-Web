export function formatDate() {
  var data = new Date(),
    dia = data.getDate().toString(),
    diaF = dia.length === 1 ? "0" + dia : dia,
    mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
    mesF = mes.length === 1 ? "0" + mes : mes,
    anoF = data.getFullYear().toString();
  anoF = anoF.substr(2, anoF.length - 1);
  return diaF + "/" + mesF + "/" + anoF;
}

export function compareDates(now, date) {
  now = now.split("/");
  date = date.split("/");

  /*------Example---------
    now        Event date
    13/04/20   14/04/20
  ------------------------*/

  //date have passed
  if (date[0] < now[0] && date[1] <= now[1] && date[2] <= now[2]) return true;
  //date haven`t passed
  else return false;
}
