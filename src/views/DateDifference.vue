<script setup>
import { ref, computed } from 'vue'
import SystemTabs from '../components/SystemTabs.vue'
import DateFields from '../components/DateFields.vue'
import AdSpace from '@/components/AdSpace.vue'
import { useCalendar } from '../composables/useCalendar'
import { useHead, useSeoMeta } from '@unhead/vue'

useSeoMeta({
  title: 'الفرق بين تاريخين',
  description: "حاسبة الفرق (عدد الأيام المارة) بين تاريخين"
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://datetimecalcar.netlify.app/date-difference' }
  ]
})

const {
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
} = useCalendar();

const currentSystem = ref('gregorian')
const dateInput1 = ref({ day: 23, month: 8, year: 2026 })
const dateInput2 = ref({ day: 23, month: 8, year: 2026 })
const errorMessage = ref('')
const results = ref(null)
const hintText = computed(() => {
  if (currentSystem.value === 'hijri') return "أدخل تاريخين هجريين (وفق تقويم أم القرى)."
  return currentSystem.value === 'julian' ? "أدخل تاريخين وفق التقويم اليولياني." : "أدخل تاريخين وفق التقويم الغريغوري (الميلادي المعتاد)."
})

const comparisonText = ref('');
const yearsDifference = ref('');
const monthsDifference = ref('');
const weeksDifference = ref('');
const daysDifference = ref('');

function isGregorianLeapYear(y){
  return y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
}

function isJulianLeapYear(y){
  return y % 4 === 0;
}

function daysInMonthGregorian(y, m){
  return [31, isGregorianLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

function daysInMonthJulian(y, m){
  return [31, isJulianLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

function hijriDaysInMonth(y, m){
  if (checkUmAlQuraSupport()){
    if (hijriUmAlQuraToGregorianDate(y, m, 30)) return 30;
    if (hijriUmAlQuraToGregorianDate(y, m, 29)) return 29;
    return 0;
  }
  const first = hijriTabularToJDN(y, m, 1);
  const next = m === 12 ? hijriTabularToJDN(y + 1, 1, 1) : hijriTabularToJDN(y, m + 1, 1);
  return next - first;
}

function daysBetweenGre(d1, d2){
    const dt1 = new Date(d1.year, d1.month - 1, d1.day);
    const dt2 = new Date(d2.year, d2.month - 1, d2.day);
    const difms = dt2 - dt1;
    //alert(d1);
    return Math.floor(difms/86400000);
}

function validateInput(system, y, m, d){
  if (![y,m,d].every(Number.isInteger)) return "الرجاء إدخال قيم صحيحة في التاريخين.";
  if (m < 1 || m > 12) return "رقم الشهر يجب أن يكون بين 1 و12.";
  let max;
  if (system === "gregorian") max = daysInMonthGregorian(y,m);
  else if (system === "julian") max = daysInMonthJulian(y,m);
  else max = hijriDaysInMonth(y,m);
  if (!max) return "تعذر التحقق من هذا التاريخ الهجري وفق تقويم أم القرى في هذا المتصفح.";
  if (d < 1 || d > max) return `اليوم غير صالح في هذا الشهر؛ المجال الصحيح هو 1-${max}.`;
  if (system === "hijri" && checkUmAlQuraSupport() && !hijriUmAlQuraToGregorianDate(y,m,d)) return "هذا التاريخ الهجري غير موجود في نطاق تقويم أم القرى المدعوم من المتصفح.";
  return "";
}

const handleCalculate = () => {
    let date1 = dateInput1.value;
    let date2 = dateInput2.value;
    let yearsDy, monthsDy, daysDy, monthsDm, daysDm, daysDd;
    let dg1, dg2;
    let theError1 = validateInput(currentSystem.value, date1.year, date1.month, date1.day);
    let theError2 = validateInput(currentSystem.value, date2.year, date2.month, date2.day);
    if(theError1){
        errorMessage.value = theError1;
        results.value = null;
        return
    }
    else if (theError2){
        errorMessage.value = theError2;
        results.value = null;
        return
    }
    if (date1.year === date2.year && date1.month === date2.month && date1.day === date2.day){
        comparisonText.value = "التاريخان يشيران إلى اليوم نفسه";
    }
    else if (date1.year > date2.year || (date1.year === date2.year && date1.month > date2.month) || (date1.year === date2.year && date1.month === date2.month && date1.day > date2.day)){
        [date1, date2] = [date2, date1];
        comparisonText.value = 'التاريخ الثاني يسبق الأول';
    }
    else{
        comparisonText.value = 'التاريخ الأول يسبق الثاني';
    }
    if (currentSystem.value === 'gregorian'){
        //alert(date1);
        yearsDy = date2.year - date1.year;
        monthsDy = date2.month - date1.month;
        if (monthsDy < 0){
            yearsDy -= 1;
            monthsDy += 12;
        }
        daysDy = date2.day - date1.day;
        if (daysDy < 0){
            daysDy += daysInMonthGregorian(date1.year, date1.month);
            monthsDy -= 1;
        }
        monthsDm = monthsDy + 12 * yearsDy;
        daysDm = daysDy;
        daysDd = daysBetweenGre(date1, date2);
    }
    else if (currentSystem.value === 'julian'){
        yearsDy = date2.year - date1.year;
        monthsDy = date2.month - date1.month;
        if (monthsDy < 0){
            yearsDy -= 1;
            monthsDy += 12;
        }
        daysDy = date2.day - date1.day;
        if (daysDy < 0){
            daysDy += daysInMonthJulian(date1.year, date1.month);
            monthsDy -= 1;
        }
        monthsDm = monthsDy + 12 * yearsDy;
        daysDm = daysDy;
        dg1 = jdnToGregorian(date1.year, date1.month, date1.day);
        dg2 = jdnToGregorian(date2.year, date2.month, date2.day);
        daysDd = daysBetweenGre(dg1, dg2);
    }
    else{
        if(!checkUmAlQuraSupport()){
            errorMessage.value = 'تقويم أم القرى غير مدعوم في متصفحك فتم عرض تقريب حسابي';
            dg1 = hijriTabularToJDN(date1.year, date1.month, date1.day);
            dg1 = jdnToGregorian (dg1.year, dg1.month, dg1.day);
            dg2 = hijriTabularToJDN(date2.year, date2.month, date2.day);
            dg2 = jdnToGregorian(dg2.year, dg2.month, dg2.day);
        }
        else{
            dg1 = hijriUmAlQuraToGregorianDate(date1.year, date1.month, date1.day);
            dg2 = hijriUmAlQuraToGregorianDate(date2.year, date2.month, date2.day);
        }
        yearsDy = date2.year - date1.year;
        monthsDy = date2.month - date1.month;
        if (monthsDy < 0){
            yearsDy -= 1;
            monthsDy += 12;
        }
        daysDy = date2.day - date1.day;
        if (daysDy < 0){
            daysDy += hijriDaysInMonth(date1.year, date1.month);
            monthsDy -= 1;
        }
        monthsDm = monthsDy + 12 * yearsDy;
        daysDm = daysDy;
        daysDd = daysBetweenGre(dg1, dg2);
    }
    let weeksD = Math.floor(daysDd / 7);
    let daysDw = daysDd - 7 * weeksD;
    yearsDifference.value = `${yearsDy} سنة و ${monthsDy} شهر و ${daysDy} يوم`;
    monthsDifference.value = `${monthsDm} شهر و ${daysDm} يوم`;
    weeksDifference.value = `${weeksD} أسبوع و ${daysDw} يوم`;
    daysDifference.value = `${daysDd} يوم`;
    if(!(theError1 || theError2)){
        errorMessage.value = '';
    }
    results.value = true;
}

</script>

<template>
    <p class="sub">
        أدخل نظام التاريخ ثم أدخل التاريخين لمعرفة المدة بينهما
    </p>

    <div class="card">
        <SystemTabs v-model="currentSystem" />

        <div class="date-box">
            <h2>
                التاريخ الأول
            </h2>
            <DateFields :system="currentSystem" v-model="dateInput1" />
        </div>

        <div class="date-box">
            <h2>
                التاريخ الثاني
            </h2>
            <DateFields :system="currentSystem" v-model="dateInput2" />
        </div>

        <div class="hint">{{  hintText  }}</div>

        <button class="calc" @click="handleCalculate">
            قارن التاريخين
        </button>
        <div v-show="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
    <div v-if="results" class="card comparison">
        <div class="comparison-banner">{{  comparisonText  }}</div>
        <div class="diff-title">الفرق بين التاريخين:</div>
        <div class="diff-item">
            <span class="lbl">بالسنوات:</span>
            <span class="val">{{  yearsDifference  }}</span>
        </div>
        <div class="diff-item">
            <span class="lbl">بالشهور:</span>
            <span class="val">{{  monthsDifference  }}</span>
        </div>
        <div class="diff-item">
            <span class="lbl">بالأسابيع:</span>
            <span class="val">{{  weeksDifference  }}</span>
        </div>
        <div class="diff-item">
            <span class="lbl">بالأيام</span>
            <span class="val">{{  daysDifference  }}</span>
        </div>
    </div>
    <AdSpace />

</template>

<style scoped></style>