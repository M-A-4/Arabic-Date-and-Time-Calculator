<template>
    <p class="sub">أدخل تاريخًا بأي نظام واحصل عليه بالأنظمة الثلاثة + يوم الأسبوع</p>

    <div class="card">
      <SystemTabs v-model="currentSystem" />
      <DateFields :system="currentSystem" v-model="dateInput" />
      
      <div class="hint">{{ hintText }}</div>
      <button class="calc" @click="handleCalculate">احسب التاريخ</button>
      <div v-show="errorMessage" class="error">{{ errorMessage }}</div>
    </div>

    <div v-show="resultsVisible" class="results">
      <div class="weekday-badge">يوم {{ results.weekday }}</div>
      <ResultCard label="غريغوري (ميلادي)" v-model="results.gregorian" />
      <ResultCard label="يولياني" v-model="results.julian" />
      <ResultCard label="هجري (أم القرى)" v-model="results.hijri" />
      <div v-if="results.note" class="note">{{ results.note }}</div>
    </div>

    <AdSpace />
</template>

<script setup>
import { ref, computed } from 'vue'
import SystemTabs from '../components/SystemTabs.vue'
import DateFields from '../components/DateFields.vue'
import AdSpace from '@/components/AdSpace.vue'
import { useCalendar } from '../composables/useCalendar'
import ResultCard from '@/components/ResultCard.vue'
import { useSeoMeta } from '@unhead/vue'
import { useHead } from '@unhead/vue'


useSeoMeta({
  title: 'رزنامة الشهر – غريغوري / يولياني / هجري',
  description: "إظهار رزنامة أي شهر تقوم بإدخاله"
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://datetimecalcar.netlify.app/date-converter' }
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
const dateInput = ref({ day: 23, month: 8, year: 2026 })
const errorMessage = ref('')

const results = ref({
  weekday: '',
  gregorian: '',
  julian: '',
  hijri: '',
  note: ''
})
const resultsVisible = ref(false)

const hintText = computed(() => {
  if (currentSystem.value === 'hijri') return "أدخل تاريخًا هجريًا (وفق تقويم أم القرى) لتحويله إلى الغريغوري واليولياني."
  return currentSystem.value === 'julian' ? "أدخل تاريخًا وفق التقويم اليولياني." : "أدخل تاريخًا وفق التقويم الغريغوري (الميلادي المعتاد)."
})

const handleCalculate = () => {
  errorMessage.value = ''
  resultsVisible.value = false;

  const system = currentSystem.value;
  const d = parseInt(dateInput.value.day, 10);
  const m = parseInt(dateInput.value.month, 10);
  const y = parseInt(dateInput.value.year);

  const maxDay = system==='hijri' ? 30 : 31;
  if (isNaN(d) || isNaN(m) || isNaN(y) || m<1 || m>12 || d<1 || d>maxDay){
    errorMessage.value = 'يرجى إدخال قيم صحيحة';
    return;
  }

  let gregorianDate;
  let hijriNoteText = "";

  if (system === 'gregorian'){
    gregorianDate = new Date(Date.UTC(y, m-1, d));
    if (gregorianDate.getUTCMonth() !== m-1){
      errorMessage.value = 'التاريخ الغريغوري المدخل غير صالح';
      return;
    }
  }

  else if (system === 'julian'){
    const jdn = julianToJDN(y,  m, d);
    const g = jdnToGregorian(jdn);
    gregorianDate = new Date(Date.UTC(g.y, g.m-1, g.d));
  }
  else{
    const found = hijriUmAlQuraToGregorianDate(y, m, d);
    if(found){
      gregorianDate = found;
    }
    else{
      const jdn = hijriTabularToJDN(y, m, d);
      const g = jdnToGregorian(jdn);
      gregorianDate = new Date(Date.UTC(g.y, g.m-1, g.d));
      hijriNoteText = checkUmAlQuraSupport() ? 'لم يعثر على تطابق دقيق في تقويم أم القرى فتم استخدام تقريب حسابي' : 'متصفحك لا يدعم تقويم أم القرى فتم استخدام تقريب حسابي' ;
    }
  }
  const gy = gregorianDate.getUTCFullYear();
  const gm = gregorianDate.getUTCMonth() + 1;
  const gd = gregorianDate.getUTCDate();

  const jdnFromGregorian = gregorianToJDN(gy, gm, gd);
  const julianResult = jdnToJulian(jdnFromGregorian);

  let hijriResult = gregorianDateToHijriUmAlQura(gregorianDate);
  if(!hijriResult){
    hijriResult = jdnToHijriTabularApprox(jdnFromGregorian);
    if(!hijriNoteText){
      hijriNoteText = 'متصفحك لا يدعم تقويم أم القرى فتم عرض تقريب حسابي';
    }
  }

  const weekday = weekdayNames[gregorianDate.getUTCDay()];

  results.value = {
    weekday : weekday,
    gregorian : `${gd} ${gregorianMonths[gm-1]} ${gy} م`,
    julian : `${julianResult.d} ${gregorianMonths[julianResult.m-1]} ${julianResult.y}`,
    hijri : `${hijriResult.d} ${hijriMonths[hijriResult.m-1]} ${hijriResult.y} هـ`,
    note : hijriNoteText
  };
  resultsVisible.value = true;
}
</script>