// src/composables/useCalendar.js
import { ref } from 'vue'

export function useCalendar() {
  const weekdayNames = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"]
  const gregorianMonths = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"]
  const hijriMonths = ["محرم","صفر","ربيع الأول","ربيع الآخر","جمادى الأولى","جمادى الآخرة","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة"]

  let UMALQURA_LOCALE = "en-US-u-ca-islamic-umalqura-nu-latn";
  let umAlQuraSupported = null;
  let umAlQuraFormatter = null;

  function gregorianToJDN(y, m, d) {
    const a = Math.floor((14 - m) / 12);
    const y2 = y + 4800 - a;
    const m2 = m + 12 * a - 3;
    return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
  }
  function jdnToGregorian(jdn) {
    const a = jdn + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor((146097 * b) / 4);
    const d2 = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d2) / 4);
    const m2 = Math.floor((5 * e + 2) / 153);
    const day = e - Math.floor((153 * m2 + 2) / 5) + 1;
    const month = m2 + 3 - 12 * Math.floor(m2 / 10);
    const year = 100 * b + d2 - 4800 + Math.floor(m2 / 10);
    return { y: year, m: month, d: day };
  }

  function julianToJDN(y, m, d){
    const a = Math.floor((14 - m) / 12);
    const y2 = y + 4800 - a;
    const m2 = m + 12 * a - 3;
    return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - 32083;
  }

  function jdnToJulian(jdn){
    const c = jdn + 32082;
    const d2 = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d2) / 4);
    const m2 = Math.floor((5 * e + 2) / 153);
    const day = e - Math.floor((153 * m2 + 2) / 5) + 1;
    const month = m2 + 3 - 12 * Math.floor(m2 / 10);
    const year = d2 - 4800 + Math.floor(m2 / 10);
    return { y: year, m: month, d: day };
  }

  function hijriUmAlQuraToGregorianDate(hy, hm, hd){
    const approxJDN = hijriTabularToJDN(hy, hm, hd);
    const approxG = jdnToGregorian(approxJDN);
    const centerDate = new Date(Date.UTC(approxG.y, approxG.m - 1, approxG.d));

    for (let offset = -6; offset <= 6; offset++){
      const candidate = new Date(centerDate);
      candidate.setUTCDate(candidate.getUTCDate() + offset);
      const hijriResult = gregorianDateToHijriUmAlQura(candidate);
      if (hijriResult && hijriResult.y === hy && hijriResult.m === hm && hijriResult.d === hd){
        return candidate;
      }
    }
    return null;
  }

  function hijriTabularToJDN(y, m, d){
    return Math.floor((11 * y + 3) / 30) + 354 * y + 30 * m - Math.floor((m - 1) / 2) + d + 1948440 - 385;
  }

  function gregorianDateToHijriUmAlQura(dateObj){
    if (!checkUmAlQuraSupport()) return null;
    const parts = umAlQuraFormatter.formatToParts(dateObj);
    const obj = {};
    parts.forEach(p => {
      if (p.type === "year" || p.type === "month" || p.type === "day"){
        obj[p.type] = parseInt(p.value, 10);
      }
    });
    if (!Number.isFinite(obj.year) || !Number.isFinite(obj.month) || !Number.isFinite(obj.day)) return null;
    return { y: obj.year, m: obj.month, d: obj.day };
  }

  function jdnToHijriTabularApprox(jdn){
    const l1 = jdn - 1948440 + 10632;
    const n = Math.floor((l1 - 1) / 10631);
    const l2 = l1 - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const m = Math.floor((24 * l3) / 709);
    const d = l3 - Math.floor((709 * m) / 24);
    const y = 30 * n + j - 30;
    return { y, m, d };
}



  function checkUmAlQuraSupport() {
    if (umAlQuraSupported !== null) return umAlQuraSupported;
    try{
      umAlQuraFormatter = new Intl.DateTimeFormat(UMALQURA_LOCALE, {
        year: "numeric", month: "numeric", day: "numeric", timeZone: "UTC"
      });
      umAlQuraSupported = umAlQuraFormatter.resolvedOptions().calendar === "islamic-umalqura";
    }catch(e){
      umAlQuraSupported = false;
    }
    return umAlQuraSupported;
  }

  function pluralUnit(n, singular, dual, plural) {
    n = Math.abs(n);
    if (n === 0) return `0 ${singular}`;
    if (n === 1) return `1 ${singular}`;
    if (n === 2) return `2 ${dual}`;
    if (n >= 3 && n <= 10) return `${n} ${plural}`;
    return `${n} ${singular}`;
}

  return {
    weekdayNames,
    gregorianMonths,
    hijriMonths,
    gregorianToJDN,
    jdnToGregorian,
    julianToJDN,
    jdnToJulian,
    hijriUmAlQuraToGregorianDate,
    hijriTabularToJDN,
    gregorianDateToHijriUmAlQura,
    jdnToHijriTabularApprox,
    checkUmAlQuraSupport,
    pluralUnit
  }
}
