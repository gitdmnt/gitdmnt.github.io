let mois = new Array(12);
mois[1] = "janvier"; mois[2] = "février"; mois[3] = "mars"; mois[4] = "avril"; mois[5] = "mai"; mois[6] = "juin"; mois[7] = "juillet"; mois[8] = "août"; mois[9] = "septembre"; mois[10] = "octobre"; mois[11] = "novembre"; mois[12] = "décembre";
let rmois = new Array(13);
rmois[1] = "vendémiaire"; rmois[2] = "brumaire"; rmois[3] = "frimaire"; rmois[4] = "nivôse"; rmois[5] = "pluviôse"; rmois[6] = "ventôse"; rmois[7] = "germinal"; rmois[8] = "floréal"; rmois[9] = "prairial"; rmois[10] = "messidor"; rmois[11] = "thermidor"; rmois[12] = "fructidor"; rmois[13] = "jour complémentaire";
let j_mois = new Array(12)
j_mois[1] = 31; j_mois[2] = 28; j_mois[3] = 31; j_mois[4] = 30; j_mois[5] = 31; j_mois[6] = 30; j_mois[7] = 31; j_mois[8] = 31; j_mois[9] = 30; j_mois[10] = 31; j_mois[11] = 30; j_mois[12] = 31; var pivot_an = 1582; pivot_mois = 10; pivot_jour = 15; rep_max = 14;
function jours_cumules(m) {
  var ind;
  var res;
  res = 0;
  for (ind = 1; ind < m; ind++) { res = res + j_mois[ind] }
  return res
}
function resultat_g() {
  let res;
  let cal;
  var x;
  var y;
  var z;
  var k;
  var b;
  var bb;
  var g;
  var f;
  var j2;
  var m2;
  var a2; var j3; var m3; var a3; j = self.document.gregorien.elements[0].value; m = self.document.gregorien.elements[1].options[self.document.gregorien.elements[1].selectedIndex].value; a = self.document.gregorien.elements[2].value; res = "choisissez une date et un calendrier"; if ((a == "") & (m == "") & (j == "")) return res; if (m == "") return "choisissez un mois !"; j = parseFloat(j); j = Math.floor(j); if ((j * 0) != 0) { self.document.gregorien.elements[0].focus(); self.document.gregorien.elements[0].select(); return "jour incorrect, ce doit être un nombre" };
  m = parseFloat(m); m = Math.floor(m); if ((m * 0) != 0) { self.document.gregorien.elements[1].focus(); self.document.gregorien.elements[1].select(); return "mois incorrect, ce doit être un nombre" }
  a = parseFloat(a); a = Math.floor(a); if ((a * 0) != 0) { self.document.gregorien.elements[2].focus(); self.document.gregorien.elements[2].select(); return "an incorrect, ce doit être un nombre" }
  x = Math.floor(a / 4); y = Math.floor(a / 100); z = Math.floor(a / 400); g = 0; cal = "(julien)"; if (a > pivot_an) g = 1; if ((a == pivot_an) && (m > pivot_mois)) g = 1; if ((a == pivot_an) && (m == pivot_mois) && (j >= pivot_jour)) g = 1; if (g == 0) { return "date invalide pour le calendrier grégorien" }
  b = 0; bb = 0; var sb; sb = 0; if (a == (4 * x)) { b = 1; bb = 1 }
  if (a == (100 * g * y)) { b = 0; sb = 1 }
  if (a == (400 * g * z)) { b = 1; sb = 0 }
  if (a > 3000) { self.document.gregorien.elements[0].focus(); self.document.gregorien.elements[0].select(); res = "un peu de sérieux (an<3001) !"; return res }
  if ((m != 2) && ((j < 1) || (j > j_mois[m]))) { self.document.gregorien.elements[0].focus(); self.document.gregorien.elements[0].select(); res = mois[m] + " comprend " + j_mois[m] + " jours !"; return res }
  if ((m == 2) && ((j < 1) || (j > (b + j_mois[2])))) { self.document.gregorien.elements[0].focus(); self.document.gregorien.elements[0].select(); res = mois[2] + " " + a + " comprend " + (b + j_mois[m]) + " jours !"; return res }
  var ssb = 0; j2 = j; m2 = m; a2 = a; j2 = j2 - (y - z - 2); f = 0; if ((sb == 1)) { if ((m < 3)) j2 = j2 + 1; if ((m == 3) && (j2 == 0)) ssb = 1; if ((m == 3) && (j2 < 0)) j2 = j2 + 1 }
  if (j2 <= 0) {
    m2 = m2 - 1; if (m2 == 2) f = b; if (m2 < 1) { m2 = 12; a2 = a2 - 1 }
    j2 = j_mois[m2] + f + j2 + ssb
  }
  var bb3 = 0; if ((m2 < 2) && ((4 * Math.floor((a2 - 1792) / 4)) == (a2 - 1792))) bb3 = -1; var tjr = (a2 - 1792) * 365 + jours_cumules(m2) + j2 + Math.floor((a2 - 1792) / 4) + bb3 - 254; if ((4 * Math.floor((a2 - 1792) / 4) == (a2 - 1792)) && (m2 < 3)) tjr = tjr - 1; if (tjr < 0) { res = "date grégorienne et julienne"; self.document.republicain.elements[0].value = ""; self.document.republicain.elements[1].selectedIndex = 13; self.document.republicain.elements[2].selectedIndex = rep_max; return res }
  a3 = Math.floor(tjr / 365); tjr = tjr - 365 * a3; m3 = Math.floor(tjr / 30); j3 = tjr - m3 * 30; m3 = m3 + 1; j3 = j3 + 1; a3 = a3 + 1; bb3 = Math.floor(a3 / 4); j3 = j3 - bb3; if (j3 <= 0) { m3 = m3 - 1; if (m3 < 1) { m3 = 13; a3 = a3 - 1; j3 = 5 + j3; if ((4 * Math.floor((a3 + 1) / 4)) == (a3 + 1)) j3 = j3 + 1 } else { j3 = 30 + j3 } }
  if (a3 > rep_max) { res = "date grégorienne et julienne"; self.document.republicain.elements[0].value = ""; self.document.republicain.elements[1].selectedIndex = 13; self.document.republicain.elements[2].selectedIndex = rep_max; return res }
  self.document.republicain.elements[0].value = j3; self.document.republicain.elements[1].selectedIndex = m3 - 1; self.document.republicain.elements[2].selectedIndex = a3 - 1; res = "date grégorienne, julienne et républicaine"; return res
}
function affiche_resultat(x) { var res; if (x == 0) res = calcrep(); if (x == 1) res = resultat_j(); if (x == 2) res = resultat_r(); self.document.result.elements[0].value = res }
MoisRev = new Array("VEND", "BRUM", "FRIM", "NIVO", "PLUV", "VENT", "GERM", "FLOR", "PRAI", "MESS", "THER", "FRUC", "COMP"); LonAn = new Array(365, 365, 366, 365, 365, 365, 366, 365, 365, 365, 366, 365, 365, 365, 100); LibJour = new Array("Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"); var PremJour = 2375839.5; var DernJour = 2381052.5; function calcrep() {
  var res; var cal; var x; var y; var z; var k; var b; var bb; var g; var f; var j2; var m2; var a2; var j3; var m3; var a3; j = self.document.gregorien.elements[0].value; m = self.document.gregorien.elements[1].options[self.document.gregorien.elements[1].selectedIndex].value; a = self.document.gregorien.elements[2].value; res = "choisissez une date et un calendrier"; if ((a == "") & (m == "") & (j == "")) return res; if (m == "") return "choisissez un mois !"; j = parseFloat(j); j = Math.floor(j); if ((j * 0) != 0) { self.document.gregorien.elements[0].focus(); self.document.gregorien.elements[0].select(); return "jour incorrect, ce doit être un nombre" }
  m = parseFloat(m); m = Math.floor(m); if ((m * 0) != 0) { self.document.gregorien.elements[1].focus(); self.document.gregorien.elements[1].select(); return "mois incorrect, ce doit être un nombre" }
  a = parseFloat(a); a = Math.floor(a); if ((a * 0) != 0) { self.document.gregorien.elements[2].focus(); self.document.gregorien.elements[2].select(); return "an incorrect, ce doit être un nombre" }
  x = Math.floor(a / 4); y = Math.floor(a / 100); z = Math.floor(a / 400); g = 0; cal = "(julien)"; if (a > pivot_an) g = 1; if ((a == pivot_an) && (m > pivot_mois)) g = 1; if ((a == pivot_an) && (m == pivot_mois) && (j >= pivot_jour)) g = 1; if (g == 0) { return "date invalide pour le calendrier grégorien" }
  b = 0; bb = 0; var sb; sb = 0; if (a == (4 * x)) { b = 1; bb = 1 }
  if (a == (100 * g * y)) { b = 0; sb = 1 }
  if (a == (400 * g * z)) { b = 1; sb = 0 }
  if (a > 3000) { self.document.gregorien.elements[0].focus(); self.document.gregorien.elements[0].select(); res = "un peu de sérieux (an<3001) !"; return res }
  if ((m != 2) && ((j < 1) || (j > j_mois[m]))) { self.document.gregorien.elements[0].focus(); self.document.gregorien.elements[0].select(); res = mois[m] + " comprend " + j_mois[m] + " jours !"; return res }
  if ((m == 2) && ((j < 1) || (j > (b + j_mois[2])))) { self.document.gregorien.elements[0].focus(); self.document.gregorien.elements[0].select(); res = mois[2] + " " + a + " comprend " + (b + j_mois[m]) + " jours !"; return res }
  var moisGreg; if (document.gregorien.g_mois2.value < 10) { moisGreg = "0" + document.gregorien.g_mois2.value } else { moisGreg = document.gregorien.g_mois2.value }
  var jour; if (document.gregorien.g_jour2.value < 10) { jour = "0" + document.gregorien.g_jour2.value } else { jour = document.gregorien.g_jour2.value }
  if ((jour != "0") && (moisGreg != "0") && (document.gregorien.g_an2.value != "")) { var dateSaisie = jour + "/" + moisGreg + "/" + document.gregorien.g_an2.value; var s = new String(ToRev(dateSaisie)); if ((s != "")) { var arr = s.split("/"); document.republicain.r_jour2.value = arr[0]; document.republicain.r_mois2.selectedIndex = indexMoisRep(arr[1]); document.republicain.r_an2.selectedIndex = indexAnRep(arr[2]) } else { document.republicain.r_jour2.value = ""; document.republicain.r_mois2.selectedIndex = 13; document.republicain.r_an2.selectedIndex = 14 } } else { document.republicain.r_jour2.value = ""; document.republicain.r_mois2.selectedIndex = 13; document.republicain.r_an2.selectedIndex = 14 }
  res = ""; return res
}
function indexMoisRep(moisRep) {
  var iMoisRep = 13; if (moisRep == "VEND") { iMoisRep = 0 }
  if (moisRep == "BRUM") { iMoisRep = 1 }
  if (moisRep == "FRIM") { iMoisRep = 2 }
  if (moisRep == "NIVO") { iMoisRep = 3 }
  if (moisRep == "PLUV") { iMoisRep = 4 }
  if (moisRep == "VENT") { iMoisRep = 5 }
  if (moisRep == "GERM") { iMoisRep = 6 }
  if (moisRep == "FLOR") { iMoisRep = 7 }
  if (moisRep == "PRAI") { iMoisRep = 8 }
  if (moisRep == "MESS") { iMoisRep = 9 }
  if (moisRep == "THER") { iMoisRep = 10 }
  if (moisRep == "FRUC") { iMoisRep = 11 }
  if (moisRep == "COMP") { iMoisRep = 12 }
  if (moisRep == "") { iMoisRep = 13 }
  return iMoisRep
}
function indexAnRep(anRep) {
  var iAnRep = 14; if (anRep == "01") { iAnRep = 0 }
  if (anRep == "02") { iAnRep = 1 }
  if (anRep == "03") { iAnRep = 2 }
  if (anRep == "04") { iAnRep = 3 }
  if (anRep == "05") { iAnRep = 4 }
  if (anRep == "06") { iAnRep = 5 }
  if (anRep == "07") { iAnRep = 6 }
  if (anRep == "08") { iAnRep = 7 }
  if (anRep == "09") { iAnRep = 8 }
  if (anRep == "10") { iAnRep = 9 }
  if (anRep == "11") { iAnRep = 10 }
  if (anRep == "12") { iAnRep = 11 }
  if (anRep == "13") { iAnRep = 12 }
  if (anRep == "14") { iAnRep = 13 }
  if (anRep == "") { iAnRep = 14 }
  return iAnRep
}
function RevTo(param) {
  DateRev = new String(param); var CalJd = PremJour; borne = Number(DateRev.substring(8, 10)); if ((borne < 1) || (borne > 15)) { alert("L'annee " + borne + " est invalide"); return ("") }
  for (var ind = 0; ind <= (borne - 2); ind++) { CalJd += LonAn[ind] }
  ind = 0; ws = DateRev.substring(3, 7); while ((ws != MoisRev[ind]) && (ind < 12)) { ind++ }
  if (MoisRev[ind] != ws) { alert("Le mois " + ws + " est incorrect"); return ("") }
  CalJd += 30 * ind; var jour = Number(DateRev.substring(0, 2)); CalJd += jour - 1; return (Jdat(CalJd))
}
function ToRev(param) {
  var SaiDate = new String(param); var CalJd = jd(SaiDate); if ((CalJd < PremJour) || (CalJd > DernJour)) { return ("") } else {
    var CalJd2 = PremJour; var Ar = 0; while ((CalJd2 + LonAn[Ar]) <= CalJd) { CalJd2 += LonAn[Ar++] }
    var Reste = CalJd - CalJd2; var Mr = Math.floor(Reste / 30); var Jr = (Reste % 30) + 1; Ar++; jjs = new String(Jr); aas = new String(Ar); while (jjs.length < 2)
      jjs = "0" + jjs; while (aas.length < 2)
      aas = "0" + aas; return (jjs + "/" + MoisRev[Mr] + "/" + aas)
  }
}
function jd(param) {
  var ws = new String(param); var jj = Number(ws.substring(0, 2)); var mm = Number(ws.substring(3, 5)); var aa = Number(ws.substring(6, 10)); if (mm < 3) { var a = aa - 1; var m = mm + 12 } else { var a = aa; var m = mm }
  var jdd = (Math.floor(365.25 * a)); jdd += Math.floor(30.6001 * (m + 1.)); jdd += jj; jdd += 1720994.5; if ((aa + (mm / 100.) + (jj / 10000.)) > 1582.1014) { jdd = jdd + 2 - Math.floor(a / 100.) + Math.floor(a / 400.) }
  return jdd
}
function resultat_j() {
  var res; var cal; var x; var y; var z; var k; var b; var bb; var g; var f; var j2; var m2; var a2; var j3; var m3; var a3; j = self.document.julien.elements[0].value; m = self.document.julien.elements[1].options[self.document.julien.elements[1].selectedIndex].value; a = self.document.julien.elements[2].value; res = "choisissez une date et un calendrier"; if ((a == "") & (m == "") & (j == "")) return res; if (m == "") return "choisissez un mois !"; j = parseFloat(j); j = Math.floor(j); if ((j * 0) != 0) { self.document.julien.elements[0].focus(); self.document.julien.elements[0].select(); return "jour incorrect, ce doit être un nombre" }
  m = parseFloat(m); m = Math.floor(m); if ((m * 0) != 0) { self.document.julien.elements[1].focus(); self.document.julien.elements[1].select(); return "mois incorrect, ce doit être un nombre" }
  a = parseFloat(a); a = Math.floor(a); if ((a * 0) != 0) { self.document.julien.elements[2].focus(); self.document.julien.elements[2].select(); return "an incorrect, ce doit être un nombre" }
  x = Math.floor(a / 4); y = Math.floor(a / 100); z = Math.floor(a / 400); g = 0; cal = "(julien)"; if (a > pivot_an) g = 1; if ((a == 1582) && (m > 10)) g = 1; if ((a == 1582) && (m == 10) && (j >= 5)) g = 1; b = 0; bb = 0; var sb; sb = 0; if (a == (4 * x)) { b = 1; bb = 1 }
  if (a == (100 * g * y)) { b = 0; sb = 1 }
  if (a == (400 * g * z)) { b = 1; sb = 0 }
  if (a > 3000) { self.document.julien.elements[0].focus(); self.document.julien.elements[0].select(); res = "un peu de sérieux (an<3001) !"; return res }
  if (a < 1) { self.document.julien.elements[2].focus(); self.document.julien.elements[2].select(); res = "an > 0 !"; return res }
  if ((m != 2) && ((j < 1) || (j > j_mois[m]))) { self.document.julien.elements[0].focus(); self.document.julien.elements[0].select(); res = mois[m] + " comprend " + j_mois[m] + " jours !"; return res }
  if ((m == 2) && ((j < 1) || (j > (bb + j_mois[2])))) { self.document.julien.elements[0].focus(); self.document.julien.elements[0].select(); res = mois[2] + " " + a + " comprend " + (bb + j_mois[m]) + " jours !"; return res }
  if (g == 0) { self.document.gregorien.elements[0].value = ""; self.document.gregorien.elements[1].selectedIndex = 13; self.document.gregorien.elements[0].value = ""; self.document.republicain.elements[0].value = ""; self.document.republicain.elements[1].selectedIndex = 13; self.document.republicain.elements[2].selectedIndex = rep_max; return "calendrier julien uniquement" }
  var ssb = 0; j2 = j; m2 = m; a2 = a; j2 = j2 + (y - z - 2); f = 0; if ((sb == 1)) { if ((m <= 2)) j2 = j2 - 1 }
  if ((m2 != 2) && (j2 > j_mois[m2])) { m2 = m2 + 1; j2 = j2 - j_mois[m2 - 1] }
  if ((m2 == 2) && (j2 > (j_mois[m2] + b))) { m2 = m2 + 1; j2 = j2 - j_mois[m2 - 1] - b }
  if (m2 > 12) { m2 = 1; a2 = a2 + 1 }
  self.document.gregorien.elements[0].value = j2; self.document.gregorien.elements[1].selectedIndex = m2 - 1; self.document.gregorien.elements[2].value = a2; res = resultat_g(); return res
}
function resultat_r() {
  var res; var cal; var b; var j2; var m2; var a2; var j3; var m3; var a3; j = self.document.republicain.elements[0].value; m = self.document.republicain.elements[1].options[self.document.republicain.elements[1].selectedIndex].value; a = self.document.republicain.elements[2].options[self.document.republicain.elements[2].selectedIndex].value; res = "choisissez une date et un calendrier"; if ((a == "") & (m == "") & (j == "")) return res; if (m == "") return "choisissez un mois !"; if (a == "") return "choisissez une année !"; j = parseFloat(j); j = Math.floor(j); if ((j * 0) != 0) { self.document.republicain.elements[0].focus(); self.document.republicain.elements[0].select(); return "jour incorrect, ce doit être un nombre" }
  m = parseFloat(m); m = Math.floor(m); if ((m * 0) != 0) { self.document.republicain.elements[1].focus(); self.document.republicain.elements[1].select(); return "mois incorrect, ce doit être un nombre" }
  a = parseFloat(a); a = Math.floor(a); if ((a * 0) != 0) { self.document.republicain.elements[2].focus(); self.document.republicain.elements[2].select(); return "an incorrect, ce doit être un nombre" }
  b = 0; if ((4 * Math.floor((a + 1) / 4)) == (a + 1)) b = 1; if ((m < 12) && ((j < 1) || (j > 30))) { self.document.republicain.elements[0].focus(); self.document.republicain.elements[0].select(); res = rmois[m] + " comprend 30 jours !"; return res }
  if ((m == 13) && ((j < 1) || (j > (b + 5)))) { self.document.republicain.elements[0].focus(); self.document.republicain.elements[0].select(); res = "an " + a + " comprend " + (b + 5) + " jours complémentaires !"; return res }
  var d; var g; var h; var i; var bb; b = Math.floor(a / 4); d = j + 30 * (m - 1) + 365 * (a - 1) + b - 101; if (d > 2615) d = d + 1; g = Math.floor(d / (365 * 4 + 1)); d = d - (365 * 4 + 1) * g; h = Math.floor(d / 365); if (h == 4) h = h - 1; a = 1793 + 4 * g + h; d = d - 365 * h; i = 0; if ((4 * Math.floor(a / 4)) == a) i = 1; m2 = 1; bb = 0; while (d > (j_mois[m2] + bb)) { d = d - j_mois[m2] - bb; m2 = m2 + 1; bb = 0; if (m2 == 2) bb = i }
  if (d == 0) { d = 31; m2 = 12; a = a - 1 }
  self.document.gregorien.elements[0].value = d; self.document.gregorien.elements[1].selectedIndex = m2 - 1; self.document.gregorien.elements[2].value = a; res = ""; return res
}
