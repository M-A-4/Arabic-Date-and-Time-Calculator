<script setup>
import AdSpace from '@/components/AdSpace.vue';
import ANumberInput from '@/components/ANumberInput.vue';
import DateFields from '@/components/DateFields.vue';
import SelectionTabs from '@/components/SelectionTabs.vue';
import SystemTabs from '@/components/SystemTabs.vue';
import { ref, computed } from 'vue' ;
import { useCalendar } from '../composables/useCalendar' ;
import ResultCard from '@/components/ResultCard.vue';
import { useSeoMeta } from '@unhead/vue';
import { useHead } from '@unhead/vue';

useSeoMeta({
  title: 'حاسبة التاريخ – سابق / لاحق',
  description: "حساب التاريخ الآتي أو التاريخ السابق قبل أو بعد مدة محددة"
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://datetimecalcar.netlify.app/date-calculator' }
  ]
})

const currentSystem = ref('gregorian');
const dateInput = ref({ day: 1, month: 1, year: 2026 });
const directionTabs = ref([
    { value: 'aft', label: 'لاحق (بعد)'},
    { value: 'bef', label: 'سابق (قبل)'}
]);
const currentDirection = ref('aft');
const unitsTabs = ref([
    { value: 'years', label: 'سنوات'},
    { value: 'months', label: 'أشهر'},
    { value: 'days', label: 'أيام'}
]);
const currentUnit = ref('years');
const yearsDifference = ref(0);
const monthsDifference = ref(0);
const daysDifference = ref(0);

const errorMessage = ref('');

const hintText = computed(() => {
    return currentSystem.value === 'gregorian' 
      ? 'أدخل تاريخاً وفق التقويم الغريغوري (الميلادي)' 
      : currentSystem.value === 'julian' 
        ? 'أدخل تاريخاً وفق التقويم اليولياني' 
        : 'أدخل تاريخاً هجرياً وفق تقويم أم القرى';
});

const resultIsShown = ref(false);
const resultWeekDay = ref('');
const resultDate = ref('');
const resultSystem = ref('');

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

function validateInput(system, y, m, d){
  if (![y, m, d].every(Number.isInteger)) return "الرجاء إدخال قيم صحيحة في التاريخ.";
  if (m < 1 || m > 12) return "رقم الشهر يجب أن يكون بين 1 و12.";
  let max;
  if (system === "gregorian") max = daysInMonthGregorian(y, m);
  else if (system === "julian") max = daysInMonthJulian(y, m);
  else max = hijriDaysInMonth(y, m);
  
  if (!max) return "تعذر التحقق من هذا التاريخ الهجري في هذا المتصفح.";
  if (d < 1 || d > max) return `اليوم غير صالح في هذا الشهر؛ المجال الصحيح هو 1-${max}.`;
  
  if (system === "hijri" && checkUmAlQuraSupport() && !hijriUmAlQuraToGregorianDate(y, m, d)) {
    return "هذا التاريخ الهجري غير موجود في نطاق تقويم أم القرى المدعوم.";
  }
  return "";
}

const handleCalculate = () => {
  const system = currentSystem.value;
  const factor = currentDirection.value === 'aft' ? 1 : -1;
  let targetYear = dateInput.value.year;
  let targetMonth = dateInput.value.month;
  let targetDay = dateInput.value.day;

  let theError = validateInput(system, targetYear, targetMonth, targetDay);
  if (theError) {
    errorMessage.value = theError;
    resultIsShown.value = false;
    return;
  }

  // 2. تطبيق الحسابات الخاصة بالسنوات والأشهر أولاً قبل الانتقال لـ JDN لتفادي تفاوت أطوال الشهور
  if (currentUnit.value === 'years') {
    targetYear += yearsDifference.value * factor;
    targetMonth += monthsDifference.value * factor;
  } else if (currentUnit.value === 'months') {
    targetMonth += monthsDifference.value * factor;
  }

  while (targetMonth > 12) {
    targetMonth -= 12;
    targetYear += 1;
  }
  while (targetMonth < 1) {
    targetMonth += 12;
    targetYear -= 1;
  }

  // ضبط اليوم إذا أصبح خارج نطاق الشهر الجديد بعد إضافة الأشهر/السنوات
  let maxDays;
  if (system === 'gregorian') maxDays = daysInMonthGregorian(targetYear, targetMonth);
  else if (system === 'julian') maxDays = daysInMonthJulian(targetYear, targetMonth);
  else maxDays = hijriDaysInMonth(targetYear, targetMonth);

  if (targetDay > maxDays) {
    targetDay = maxDays; 
  }

  // 3. تحويل التاريخ (بعد تعديل السنوات والأشهر) إلى JDN لإضافة أو طرح الأيام بدقة
  let jdn = 0;
  if (system === 'gregorian') {
    jdn = gregorianToJDN(targetYear, targetMonth, targetDay);
  } else if (system === 'julian') {
    jdn = julianToJDN(targetYear, targetMonth, targetDay);
  } else { // هجري
    if (checkUmAlQuraSupport()) {
      const gregDate = hijriUmAlQuraToGregorianDate(targetYear, targetMonth, targetDay);
      if (!gregDate) {
        errorMessage.value = "التاريخ المدخل يقع خارج نطاق تقويم أم القرى.";
        resultIsShown.value = false;
        return;
      }
      jdn = gregorianToJDN(gregDate.getUTCFullYear(), gregDate.getUTCMonth() + 1, gregDate.getUTCDate());
    } else {
      jdn = hijriTabularToJDN(targetYear, targetMonth, targetDay);
    }
  }

  // إضافة أو طرح الأيام المباشرة
  jdn += daysDifference.value * factor;

  // 4. تحديد يوم الأسبوع (ثابت عبر كافة الأنظمة)
  const dayIndex = ((jdn + 1) % 7 + 7) % 7; 
  resultWeekDay.value = weekdayNames[dayIndex];

  errorMessage.value = '';
  
  if (system === 'gregorian') {
    const res = jdnToGregorian(jdn);
    resultSystem.value = 'غريغوري (ميلادي)';
    resultDate.value = `${res.d} ${gregorianMonths[res.m - 1]} ${res.y}`;
  } 
  else if (system === 'julian') {
    const res = jdnToJulian(jdn);
    resultSystem.value = 'يولياني';
    resultDate.value = `${res.d} ${gregorianMonths[res.m - 1]} ${res.y}`;
  } 
  else if (system === 'hijri') {
    resultSystem.value = 'هجري (أم القرى)';
    if (checkUmAlQuraSupport()) {
      const gRes = jdnToGregorian(jdn);
      const gDate = new Date(Date.UTC(gRes.y, gRes.m - 1, gRes.d));
      const hRes = gregorianDateToHijriUmAlQura(gDate);
      if (hRes) {
        resultDate.value = `${hRes.d} ${hijriMonths[hRes.m - 1]} ${hRes.y}`;
      } else {
        const hTab = jdnToHijriTabularApprox(jdn);
        resultDate.value = `${hTab.d} ${hijriMonths[hTab.m - 1]} ${hTab.y} (اصطلاحي)`;
      }
    } else {
      const hTab = jdnToHijriTabularApprox(jdn);
      resultDate.value = `${hTab.d} ${hijriMonths[hTab.m - 1]} ${hTab.y}`;
    }
  }

  resultIsShown.value = true;
}
</script>


<template>
    <p class="sub">
        اختر نظام التاريخ وأدخل التاريخ ثم حدد الفرق لحساب تاريخ سابق أو لاحق
    </p>
    <div class="card">
        <SystemTabs v-model="currentSystem" />
        <div class="section-title">
            تاريخ البداية
        </div>
        <DateFields v-model="dateInput" :system="currentSystem" />
        <div class="hint">{{  hintText  }}</div>
        <div class="section-title" style="margin-top:20px">
            الاتجاه
        </div>
        <SelectionTabs v-model="currentDirection" :options="directionTabs" />
        <div class="section-title">
            وحدة الفرق
        </div>
        <SelectionTabs v-model="currentUnit" :options="unitsTabs" />
        <div class="div-fields">
            <ANumberInput v-model="yearsDifference" label="عدد السنوات" v-show="currentUnit === 'years'" />
            <ANumberInput v-model="monthsDifference" label="عدد الأشهر" v-show="['years', 'months'].includes(currentUnit)" />
            <ANumberInput v-model="daysDifference" label="عدد الأيام" />
        </div>
        <button class="calc" @click="handleCalculate"> احسب التاريخ </button>
        <div v-show="errorMessage" class="error">{{  errorMessage  }}</div>
    </div>

    <div class="results" v-show="resultIsShown">
      <ResultCard label="التاريخ المحسوب" v-model="resultDate" />
      <ResultCard label="يوم الأسبوع" v-model="resultWeekDay" />
      <ResultCard label="النظام" v-model="resultSystem" />
    </div>

    <AdSpace />
</template>

<style scoped>
/* ========== حاسبة التاريخ – أنماط إضافية ========== */

/* عناوين الأقسام */
.section-title{
  font-size: .85rem;
  font-weight: bold;
  color: var(--accent);
  margin-bottom: 10px;
  padding-right: 4px;
}

/* تبويبات الاتجاه (سابق / لاحق) */
.direction-tabs,
.unit-tabs{
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.direction-tabs label,
.unit-tabs label{
  flex: 1;
  min-width: 100px;
  text-align: center;
  padding: 10px 8px;
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  font-size: .9rem;
  transition: .15s;
  user-select: none;
}
.direction-tabs input,
.unit-tabs input{
  display: none;
}
.direction-tabs label.active-tab,
.unit-tabs label.active-tab {
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-color: transparent;
  font-weight: bold;
  color: #0f172a;
}

/* حقول الفرق */
.diff-fields{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 4px;
}
.diff-fields .field label{
  display: block;
  font-size: .8rem;
  color: var(--muted);
  margin-bottom: 6px;
}
.diff-fields input[type=number]{
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #0f172a;
  color: var(--text);
  font-size: 1rem;
  text-align: center;
}
.diff-fields input[type=number]:focus{
  outline: 2px solid var(--accent);
}

/* للشاشات الصغيرة */
@media (max-width: 520px){
  .diff-fields{
    grid-template-columns: 1fr;
  }
  .direction-tabs label,
  .unit-tabs label{
    min-width: 80px;
    font-size: .82rem;
    padding: 8px 6px;
  }
}
</style>