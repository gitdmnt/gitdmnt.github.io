export const RevoDate = () => {
  const mjd_from_gregorian = (y, m, d) => {
    return Math.floor(365.25 * (m < 2 ? y - 1 : y)) + Math.floor((m < 2 ? y - 1 : y) / 400) - Math.floor((m < 2 ? y - 1 : y) / 100) + Math.floor(30.59 * ((m < 2 ? m + 1 + 12 : m + 1) - 2)) + d - 678912; // 修正ユリウス日; wikipediaより

  }
  const r_month_name_array = [
    "Vendémiaire", "Brumaire", "Frimaire",
    "Nivôse", "Pluviôse", "Ventôse",
    "Germinal", "Floréal", "Prairial",
    "Messidor", "Thermidor", "Fructidor",
    ""
  ]
  const r_left_day_name_array = [
    "La Fête de la Vertu",
    "La Fête du Génie",
    "La Fête du Travail",
    "La Fête de l'Opinion",
    "La Fête des Récompenses",
    "La Fête de la Révolution",
  ]

  const to_roman = (n) => {
    const n1000 = Math.floor(n / 1000);
    const n100 = Math.floor((n % 1000) / 100);
    const n10 = Math.floor((n % 100) / 10);
    const n1 = n % 10;
    const r1000 = ["", "M", "MM", "MMM"];
    const r100 = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
    const r10 = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
    const r1 = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
    return r1000[n1000] + r100[n100] + r10[n10] + r1[n1];
  }

  const republican_from_gregorian = (y, m, d) => {
    const mjd = mjd_from_gregorian(y, m, d);
    const mjd_r_new_year = (m > 8 || m >= 8 && d >= 22) ? mjd_from_gregorian(y, 8, 22) : mjd_from_gregorian(y - 1, 8, 22);
    const day_num_from_beginning = mjd - mjd_r_new_year + 1;
    const r_year = y - 1722 + ((m > 8 || m >= 8 && d >= 22) ? 1 : 0);
    const r_year_roman = to_roman(r_year);
    const r_month_index = Math.floor(day_num_from_beginning / 30);
    const r_month_name = r_month_name_array[r_month_index];
    const r_date = (day_num_from_beginning - 1) % 30 + 1;
    const r_day = r_date % 10;
    const r_left_day = r_month_index === 12 ? r_left_day_name_array[r_date - 1] : "";
    return [[r_year, r_month_index, r_date, r_day], [r_year_roman, r_month_name, r_left_day]];
  }

  const today = new Date();
  const g_year = today.getFullYear();
  const g_month = today.getMonth();
  const g_date = today.getDate();
  return republican_from_gregorian(g_year, g_month, g_date);
}

