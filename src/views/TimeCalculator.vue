<script setup>
import AdSpace from '@/components/AdSpace.vue';
import ANumberInput from '@/components/ANumberInput.vue';
import DateFields from '@/components/DateFields.vue';
import SelectionTabs from '@/components/SelectionTabs.vue';
import SystemTabs from '@/components/SystemTabs.vue';
import ResultCard from '@/components/ResultCard.vue';
import { ref, computed } from 'vue';
import { useCalendar } from '../composables/useCalendar';
import { useHead, useSeoMeta } from '@unhead/vue';

useSeoMeta({
  title: 'حاسبة الوقت السابق/اللاحق',
  description: "حساب الوقت الآتي أو الوقت السابق قبل أو بعد مدة محددة"
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://datetimecalcar.netlify.app/time-calculator' }
  ]
})

const currentSystem = ref('gregorian');
const dateInput = ref({ day: 23, month: 8, year: 2026 });

const hourInput = ref(12);
const minuteInput = ref(0);
const secondInput = ref(0);

const directionTabs = ref([
    { value: 'aft', label: 'لاحق (بعد)' },
    { value: 'bef', label: 'سابق (قبل)' }
]);
const currentDirection = ref('aft');

const diffDays = ref(0);
const diffHours = ref(0);
const diffMinutes = ref(0);
const diffSeconds = ref(0);

const errorMessage = ref('');

const hintText = computed(() => {
  return currentSystem.value === 'gregorian'
    ? 'أدخل تاريخًا ووقتًا وفق التقويم الغريغوري (الميلادي).'
    : currentSystem.value === 'julian'
      ? 'أدخل تاريخًا وفق التقويم اليولياني والوقت.'
      : 'أدخل تاريخًا هجريًا (تقويم أم القرى) والوقت.';
});

const resultIsShown = ref(false);
const resultWeekDay = ref('');
const resultDate = ref('');
const resultTime = ref('');
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

// --- دوال التحقق المساعدة ---
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

function validateTime(h, min, s){
  if (![h, min, s].every(Number.isInteger)) return "الرجاء إدخال وقت صحيح.";
  if (h < 0 || h > 23) return "الساعة يجب أن تكون بين 0 و23.";
  if (min < 0 || min > 59 || s < 0 || s > 59) return "الدقيقة والثانية يجب أن تكونا بين 0 و59.";
  return "";
}

function pad2(n){ return n.toString().padStart(2, "0"); }

// --- المعالجة الرئيسية ---
const handleCalculate = () => {
  const system = currentSystem.value;
  const factor = currentDirection.value === 'aft' ? 1 : -1;
  const { day, month, year } = dateInput.value;

  const dateError = validateInput(system, year, month, day);
  if (dateError) {
    errorMessage.value = dateError;
    resultIsShown.value = false;
    return;
  }

  const timeError = validateTime(hourInput.value, minuteInput.value, secondInput.value);
  if (timeError) {
    errorMessage.value = timeError;
    resultIsShown.value = false;
    return;
  }

  // 1) تحويل تاريخ البداية إلى غريغوري (y, m, d)
  let gregY, gregM, gregD;

  if (system === 'gregorian') {
    gregY = year; gregM = month; gregD = day;
  } else if (system === 'julian') {
    const jdn = julianToJDN(year, month, day);
    const g = jdnToGregorian(jdn);
    gregY = g.y; gregM = g.m; gregD = g.d;
  } else { // hijri
    if (checkUmAlQuraSupport()) {
      const found = hijriUmAlQuraToGregorianDate(year, month, day);
      if (!found) {
        errorMessage.value = "التاريخ المدخل يقع خارج نطاق تقويم أم القرى.";
        resultIsShown.value = false;
        return;
      }
      gregY = found.getUTCFullYear();
      gregM = found.getUTCMonth() + 1;
      gregD = found.getUTCDate();
    } else {
      const jdn = hijriTabularToJDN(year, month, day);
      const g = jdnToGregorian(jdn);
      gregY = g.y; gregM = g.m; gregD = g.d;
    }
  }

  // 2) إنشاء الطابع الزمني وإضافة الفرق
  const startMs = Date.UTC(gregY, gregM - 1, gregD, hourInput.value, minuteInput.value, secondInput.value);
  const totalDiffMs = factor * (
    diffDays.value * 86400000 +
    diffHours.value * 3600000 +
    diffMinutes.value * 60000 +
    diffSeconds.value * 1000
  );
  const finalDate = new Date(startMs + totalDiffMs);

  // 3) استخراج المكوّنات الغريغورية للناتج
  const rgy = finalDate.getUTCFullYear();
  const rgm = finalDate.getUTCMonth() + 1;
  const rgd = finalDate.getUTCDate();
  resultWeekDay.value = weekdayNames[finalDate.getUTCDay()];

  // 4) تحويل الناتج إلى النظام المطلوب
  errorMessage.value = '';

  if (system === 'gregorian') {
    resultSystem.value = 'غريغوري (ميلادي)';
    resultDate.value = `${rgd} ${gregorianMonths[rgm - 1]} ${rgy}`;
  } else if (system === 'julian') {
    const jdn = gregorianToJDN(rgy, rgm, rgd);
    const res = jdnToJulian(jdn);
    resultSystem.value = 'يولياني';
    resultDate.value = `${res.d} ${gregorianMonths[res.m - 1]} ${res.y}`;
  } else { // hijri
    resultSystem.value = 'هجري (أم القرى)';
    const hRes = gregorianDateToHijriUmAlQura(finalDate);
    if (hRes) {
      resultDate.value = `${hRes.d} ${hijriMonths[hRes.m - 1]} ${hRes.y}`;
    } else {
      const jdn = gregorianToJDN(rgy, rgm, rgd);
      const hTab = jdnToHijriTabularApprox(jdn);
      resultDate.value = `${hTab.d} ${hijriMonths[hTab.m - 1]} ${hTab.y} (اصطلاحي)`;
    }
  }

  resultTime.value = `${pad2(finalDate.getUTCHours())}:${pad2(finalDate.getUTCMinutes())}:${pad2(finalDate.getUTCSeconds())}`;
  resultIsShown.value = true;
}
</script>

<template>
    <p class="sub">
        أدخل التاريخ والوقت، ثم حدد الفرق الزمني لحساب الناتج
    </p>

    <div class="card">
        <SystemTabs v-model="currentSystem" />

        <div class="section-title">
            تاريخ البداية
        </div>
        <DateFields v-model="dateInput" :system="currentSystem" />

        <div class="section-title" style="margin-top:16px">
            وقت البداية
        </div>
        <div class="time-fields">
            <ANumberInput v-model="hourInput" label="الساعة" />
            <ANumberInput v-model="minuteInput" label="الدقيقة" />
            <ANumberInput v-model="secondInput" label="الثانية" />
        </div>

        <div class="hint">{{  hintText  }}</div>

        <div class="section-title" style="margin-top:20px">
            الاتجاه
        </div>
        <SelectionTabs v-model="currentDirection" :options="directionTabs" />

        <div class="section-title" style="margin-top:20px">
            فارق الزمن
        </div>
        <div class="time-fields diff-time-fields">
            <ANumberInput v-model="diffDays" label="أيام" />
            <ANumberInput v-model="diffHours" label="ساعات" />
            <ANumberInput v-model="diffMinutes" label="دقائق" />
            <ANumberInput v-model="diffSeconds" label="ثوانٍ" />
        </div>

        <button class="calc" @click="handleCalculate"> احسب التاريخ والوقت </button>
        <div v-show="errorMessage" class="error">{{  errorMessage  }}</div>
    </div>

    <div class="results" v-show="resultIsShown">
      <ResultCard label="التاريخ المحسوب" v-model="resultDate" />
      <ResultCard label="الوقت المحسوب" v-model="resultTime" />
      <ResultCard label="يوم الأسبوع" v-model="resultWeekDay" />
      <ResultCard label="النظام" v-model="resultSystem" />
    </div>

    <AdSpace />
</template>

<style scoped>
/* ========== حاسبة التاريخ والوقت – أنماط إضافية ========== */

/* عناوين الأقسام */
.section-title{
  font-size: .85rem;
  font-weight: bold;
  color: var(--accent);
  margin-bottom: 10px;
  padding-right: 4px;
}

/* تبويبات الاتجاه (سابق / لاحق) */
.direction-tabs{
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.direction-tabs label{
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
.direction-tabs input{
  display: none;
}
.direction-tabs label.active-tab {
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-color: transparent;
  font-weight: bold;
  color: #0f172a;
}

/* ===== حقول الوقت (مألوفة بصرياً كما في time-difference.html) ===== */
.time-fields{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}
.time-field label{
  display: block;
  font-size: .8rem;
  color: var(--muted);
  margin-bottom: 6px;
  text-align: center;
}
.time-field input{
  width: 100%;
  padding: 11px 8px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #0f172a;
  color: var(--text);
  font-size: 1.05rem;
  text-align: center;
}
.time-field input:focus{
  outline: 2px solid var(--accent);
}
.time-field input::placeholder{
  color: var(--muted);
  opacity: .7;
}

/* حقول فارق الزمن (4 أعمدة) */
.diff-time-fields{
  grid-template-columns: repeat(4, 1fr);
}

/* للشاشات الصغيرة */
@media (max-width: 520px){
  .time-fields,
  .diff-time-fields{
    grid-template-columns: repeat(2, 1fr);
  }
  .direction-tabs label{
    min-width: 80px;
    font-size: .82rem;
    padding: 8px 6px;
  }
}
@media (max-width: 420px){
  .time-fields,
  .diff-time-fields{
    gap: 7px;
  }
  .time-field input{
    font-size: 1rem;
    padding: 10px 5px;
  }
}
</style>