<script setup>
import { ref, computed, watch } from 'vue'
import SystemTabs from '@/components/SystemTabs.vue'
import AdSpace from '@/components/AdSpace.vue'
import { useCalendar } from '../composables/useCalendar'
import { useSeoMeta } from '@unhead/vue'
import { useHead } from '@unhead/vue'


useSeoMeta({
  title: 'رزنامة الشهر – غريغوري / يولياني / هجري',
  description: "إظهار رزنامة أي شهر تقوم بإدخاله"
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://datetimecalcar.netlify.app/calendar' }
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

const now = new Date();
const currentSystem = ref('gregorian');
const monthInput = ref(now.getMonth() + 1);
const yearInput = ref(2026);
const errorMessage = ref('');

// حالة العرض الفعلي للرزنامة (منفصلة عن حقول الاختيار، كما في الأصل)
const calendarVisible = ref(false);
const viewSystem = ref('gregorian');
const viewYear = ref(2026);
const viewMonth = ref(8);

const monthOptions = computed(() => currentSystem.value === 'hijri' ? hijriMonths : gregorianMonths);

const hintText = computed(() => {
  if (currentSystem.value === 'hijri') return "أدخل شهرًا وسنة هجرية (تقويم أم القرى) لعرض الرزنامة.";
  return currentSystem.value === 'julian' ? "أدخل شهرًا وسنة وفق التقويم اليولياني." : "أدخل شهرًا وسنة وفق التقويم الغريغوري (الميلادي).";
});

// عند تغيير النظام: تصفير الشهر وإخفاء الرزنامة المعروضة، كما في الأصل
watch(currentSystem, () => {
  monthInput.value = 1;
  calendarVisible.value = false;
});

// --- دوال أطوال الأشهر ---
function daysInGregorianMonth(y, m){
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}
function daysInJulianMonth(y, m){
  if (m === 2) return (y % 4 === 0) ? 29 : 28;
  return [31,28,31,30,31,30,31,31,30,31,30,31][m - 1];
}
function daysInHijriMonth(hy, hm){
  if (!checkUmAlQuraSupport()) return 30;
  const g1 = hijriUmAlQuraToGregorianDate(hy, hm, 1);
  if (!g1) return 30;
  const g2 = hijriUmAlQuraToGregorianDate(hy, hm + 1 > 12 ? hy + 1 : hy, hm + 1 > 12 ? 1 : hm + 1);
  if (!g2){
    const g30 = hijriUmAlQuraToGregorianDate(hy, hm, 30);
    return g30 ? 30 : 29;
  }
  return Math.round((g2 - g1) / 86400000);
}

function getMonthStartJDN(system, y, m){
  if (system === "gregorian") return gregorianToJDN(y, m, 1);
  if (system === "julian") return julianToJDN(y, m, 1);
  const g = hijriUmAlQuraToGregorianDate(y, m, 1);
  if (g) return gregorianToJDN(g.getUTCFullYear(), g.getUTCMonth() + 1, g.getUTCDate());
  return hijriTabularToJDN(y, m, 1);
}

function getMonthLength(system, y, m){
  if (system === "gregorian") return daysInGregorianMonth(y, m);
  if (system === "julian") return daysInJulianMonth(y, m);
  return daysInHijriMonth(y, m);
}

function jdnToSystemDate(system, jdn){
  if (system === "gregorian") return jdnToGregorian(jdn);
  if (system === "julian") return jdnToJulian(jdn);
  const g = jdnToGregorian(jdn);
  const d = new Date(Date.UTC(g.y, g.m - 1, g.d));
  const h = gregorianDateToHijriUmAlQura(d);
  if (h) return h;
  return jdnToHijriTabularApprox(jdn);
}

const calendarTitle = computed(() => {
  const names = viewSystem.value === 'hijri' ? hijriMonths : gregorianMonths;
  return `${names[viewMonth.value - 1]} ${viewYear.value}`;
});

// شبكة أيام الشهر (فارغة قبل الشهر + أيام الشهر + فارغة بعد الشهر)
const calendarCells = computed(() => {
  const system = viewSystem.value;
  const y = viewYear.value;
  const m = viewMonth.value;

  const monthLen = getMonthLength(system, y, m);
  const startJDN = getMonthStartJDN(system, y, m);
  const startGregorian = jdnToGregorian(startJDN);
  const startDate = new Date(Date.UTC(startGregorian.y, startGregorian.m - 1, startGregorian.d));
  const startWeekday = startDate.getUTCDay();

  const today = new Date();
  const todayJDN = gregorianToJDN(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const cells = [];

  for (let i = 0; i < startWeekday; i++){
    const prevJDN = startJDN - (startWeekday - i);
    const prevDate = jdnToSystemDate(system, prevJDN);
    cells.push({ day: prevDate.d, other: true, today: false });
  }

  for (let day = 1; day <= monthLen; day++){
    const dayJDN = startJDN + (day - 1);
    cells.push({ day, other: false, today: dayJDN === todayJDN });
  }

  const totalCells = startWeekday + monthLen;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= remaining; i++){
    const nextJDN = startJDN + monthLen + (i - 1);
    const nextDate = jdnToSystemDate(system, nextJDN);
    cells.push({ day: nextDate.d, other: true, today: false });
  }

  return cells;
});

const handleShow = () => {
  errorMessage.value = '';
  const m = parseInt(monthInput.value, 10);
  const y = parseInt(yearInput.value, 10);

  if (isNaN(m) || isNaN(y) || m < 1 || m > 12 || y < 1 || y > 9999){
    errorMessage.value = "الرجاء إدخال قيم صحيحة للشهر (1–12) والسنة.";
    calendarVisible.value = false;
    return;
  }

  viewSystem.value = currentSystem.value;
  viewYear.value = y;
  viewMonth.value = m;
  calendarVisible.value = true;
}

const handlePrev = () => {
  viewMonth.value--;
  if (viewMonth.value < 1){ viewMonth.value = 12; viewYear.value--; }
  monthInput.value = viewMonth.value;
  yearInput.value = viewYear.value;
}

const handleNext = () => {
  viewMonth.value++;
  if (viewMonth.value > 12){ viewMonth.value = 1; viewYear.value++; }
  monthInput.value = viewMonth.value;
  yearInput.value = viewYear.value;
}
</script>

<template>
    <p class="sub">اختر نظام التاريخ والشهر والسنة لعرض رزنامة الشهر كاملةً</p>

    <div class="card">
        <SystemTabs v-model="currentSystem" />

        <div class="fields cal-fields">
            <div class="field">
                <label for="month">الشهر</label>
                <select id="month" v-model.number="monthInput">
                    <option v-for="(name, i) in monthOptions" :key="i" :value="i + 1">{{ i + 1 }} – {{ name }}</option>
                </select>
            </div>
            <div class="field">
                <label for="year">السنة</label>
                <input type="number" id="year" v-model.number="yearInput" style="direction:ltr">
            </div>
        </div>

        <div class="hint">{{ hintText }}</div>

        <button class="calc" @click="handleShow">عرض الرزنامة</button>
        <div v-show="errorMessage" class="error">{{ errorMessage }}</div>
    </div>

    <div class="calendar-card" v-show="calendarVisible">
        <div class="cal-header">
            <button class="cal-nav" @click="handlePrev" title="الشهر السابق">‹</button>
            <div class="cal-title">{{ calendarTitle }}</div>
            <button class="cal-nav" @click="handleNext" title="الشهر التالي">›</button>
        </div>

        <div class="cal-weekdays">
            <span>الأحد</span><span>الاثنين</span><span>الثلاثاء</span><span>الأربعاء</span>
            <span>الخميس</span><span>الجمعة</span><span>السبت</span>
        </div>

        <div class="cal-grid">
            <div
              v-for="(cell, index) in calendarCells"
              :key="index"
              class="cal-cell"
              :class="{ other: cell.other, today: cell.today }"
            >
                <span class="cell-day">{{ cell.day }}</span>
            </div>
        </div>

        <div class="cal-legend">
            <span class="legend-item"><span class="dot today-dot"></span>اليوم الحالي</span>
            <span class="legend-item"><span class="dot other-dot"></span>من الشهر المجاور</span>
        </div>
    </div>

    <AdSpace />
</template>

<style scoped>

.cal-fields{
  grid-template-columns: 1.4fr 1fr;
  max-width: 360px;
  margin: 0 auto;
}

.calendar-card{
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,.3);
  margin-bottom: 20px;
  overflow: hidden;
}

.cal-header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 0 4px;
}
.cal-title{
  font-size: 1.15rem;
  font-weight: bold;
  text-align: center;
  flex: 1;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.cal-nav{
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: #0f172a;
  color: var(--accent);
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
  transition: .15s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cal-nav:hover{
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  color: #0f172a;
  border-color: transparent;
}
.cal-nav:active{ transform: scale(.92); }

.cal-weekdays{
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 8px;
}
.cal-weekdays span{
  text-align: center;
  font-size: .72rem;
  color: var(--muted);
  font-weight: bold;
  padding: 6px 0;
}

.cal-grid{
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  width: 100%;
}

.cal-cell{
  position: relative;
  background: #0f172a;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding-bottom: 100%;
  height: 0;
  overflow: hidden;
  cursor: default;
  transition: .12s;
}
.cal-cell:hover{
  border-color: var(--accent);
  box-shadow: 0 0 12px rgba(56,189,248,.12);
}
.cal-cell .cell-day{
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  font-weight: bold;
  color: var(--text);
}

.cal-cell.today{
  background: linear-gradient(135deg, rgba(56,189,248,.18), rgba(167,139,250,.18));
  border-color: var(--accent);
  box-shadow: 0 0 14px rgba(56,189,248,.18);
}
.cal-cell.today .cell-day{
  color: var(--accent);
}

.cal-cell.other{
  opacity: .45;
}
.cal-cell.other .cell-day{
  color: var(--muted);
}

.cal-legend{
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.legend-item{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: .75rem;
  color: var(--muted);
}
.dot{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.today-dot{
  background: var(--accent);
  box-shadow: 0 0 6px rgba(56,189,248,.4);
}
.other-dot{
  background: var(--border);
}

.cal-weekdays span:nth-child(6){
  color: #f472b6;
}

@media (max-width: 520px){
  .cal-cell{
    border-radius: 8px;
  }
  .cal-cell .cell-day{
    font-size: .9rem;
  }
  .cal-title{
    font-size: 1rem;
  }
  .cal-weekdays span{
    font-size: .65rem;
    padding: 4px 0;
  }
  .cal-nav{
    width: 32px;
    height: 32px;
  }
}
</style>