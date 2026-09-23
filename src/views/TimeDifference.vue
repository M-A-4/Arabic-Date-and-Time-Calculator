<script setup>
import { ref } from 'vue'
import AdSpace from '@/components/AdSpace.vue'
import { useHead, useSeoMeta } from '@unhead/vue'

useSeoMeta({
  title: 'حساب الفرق بين وقتين',
  description: "حاسبة الفرق (المدة المارة) بين وقتين"
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://datetimecalcar.netlify.app/time-difference' }
  ]
})


const hour1 = ref('')
const minute1 = ref('')
const second1 = ref('')
const hour2 = ref('')
const minute2 = ref('')
const second2 = ref('')

const errorMessage = ref('')
const resultsShown = ref(false)
const resultBanner = ref('')
const hoursMinutesText = ref('')
const minutesText = ref('')
const secondsText = ref('')
const showSecondsRow = ref(false)
const dayNote = ref('')


function readTime(hourRef, minuteRef, secondRef){
  const hourText = String(hourRef.value).trim()
  const minuteText = String(minuteRef.value).trim()
  const secondText = String(secondRef.value).trim()

  if (hourText === "" || minuteText === "") {
    return { error: "الرجاء إدخال الساعة والدقيقة في الوقتين." }
  }

  const hour = Number(hourText)
  const minute = Number(minuteText)
  const second = secondText === "" ? 0 : Number(secondText)

  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    return { error: "الساعة يجب أن تكون عددًا صحيحًا بين 0 و23." }
  }
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
    return { error: "الدقيقة يجب أن تكون عددًا صحيحًا بين 0 و59." }
  }
  if (!Number.isInteger(second) || second < 0 || second > 59) {
    return { error: "الثانية يجب أن تكون عددًا صحيحًا بين 0 و59." }
  }

  return { hour, minute, second, secondsWasEntered: secondText !== "" }
}

function pad2(n){ return String(n).padStart(2, "0") }

function formatTime(hour, minute, second, includeSeconds){
  const hh = pad2(hour)
  const mm = pad2(minute)
  if (!includeSeconds) return `${hh}:${mm}`
  return `${hh}:${mm}:${pad2(second)}`
}

function arabicNumber(value){
  return value.toLocaleString("ar-EG")
}

function unit(value, one, two, many){
  if (value === 0) return `0 ${one}`
  if (value === 1) return `1 ${one}`
  if (value === 2) return `2 ${two}`
  if (value >= 3 && value <= 10) return `${arabicNumber(value)} ${many}`
  return `${arabicNumber(value)} ${one}`
}

const handleCalculate = () => {
  const first = readTime(hour1, minute1, second1)
  const second = readTime(hour2, minute2, second2)

  if (first.error) {
    errorMessage.value = first.error
    resultsShown.value = false
    return
  }
  if (second.error) {
    errorMessage.value = second.error
    resultsShown.value = false
    return
  }

  const firstTotal = first.hour * 3600 + first.minute * 60 + first.second
  let secondTotal = second.hour * 3600 + second.minute * 60 + second.second

  const isNextDay = secondTotal < firstTotal
  if (isNextDay) {
    secondTotal += 24 * 60 * 60
  }

  const difference = secondTotal - firstTotal
  const hours = Math.floor(difference / 3600)
  const minutes = Math.floor((difference % 3600) / 60)
  const seconds = difference % 60

  const includeSeconds = first.secondsWasEntered || second.secondsWasEntered

  resultBanner.value = isNextDay
    ? `الوقت الثاني في اليوم التالي: ${formatTime(second.hour, second.minute, second.second, includeSeconds)}`
    : `الوقت الثاني في اليوم نفسه: ${formatTime(second.hour, second.minute, second.second, includeSeconds)}`

  hoursMinutesText.value =
    `${unit(hours, "ساعة", "ساعتان", "ساعات")} و ${unit(minutes, "دقيقة", "دقيقتان", "دقائق")}`

  const totalMinutesFloor = Math.floor(difference / 60)
  minutesText.value = includeSeconds
    ? `${unit(totalMinutesFloor, "دقيقة", "دقيقتان", "دقائق")} و ${unit(seconds, "ثانية", "ثانيتان", "ثوانٍ")}`
    : unit(totalMinutesFloor, "دقيقة", "دقيقتان", "دقائق")

  showSecondsRow.value = includeSeconds
  if (includeSeconds) {
    secondsText.value = unit(difference, "ثانية", "ثانيتان", "ثوانٍ")
  }

  dayNote.value = isNextDay
    ? "تم عبور منتصف الليل، والفرق أقل من 24 ساعة."
    : "الفرق بين الوقتين في اليوم نفسه."

  errorMessage.value = ''
  resultsShown.value = true
}
</script>

<template>
    <p class="sub">
        أدخل وقتين لمعرفة الفرق بينهما، مع اعتبار الوقت الثاني في اليوم التالي إذا كان أسبق من الأول
    </p>

    <div class="card">
        <div class="time-pair">
            <div class="time-box">
                <h2>الوقت الأول</h2>
                <div class="time-fields" style="direction: ltr;">
                    <div class="time-field" style="direction: rtl;">
                        <label for="hour1">الساعة</label>
                        <input type="number" dir="ltr" id="hour1" v-model="hour1" min="0" max="23" placeholder="00" inputmode="numeric">
                    </div>
                    <div class="time-field" style="direction: rtl;">
                        <label for="minute1">الدقيقة</label>
                        <input type="number" dir="ltr" id="minute1" v-model="minute1" min="0" max="59" placeholder="00" inputmode="numeric">
                    </div>
                    <div class="time-field" style="direction: rtl;">
                        <label for="second1">الثانية</label>
                        <input type="number" dir="ltr" id="second1" v-model="second1" min="0" max="59" placeholder="00" inputmode="numeric">
                    </div>
                </div>
            </div>

            <div class="time-box">
                <h2>الوقت الثاني</h2>
                <div class="time-fields" style="direction: ltr;">
                    <div class="time-field" style="direction: rtl;">
                        <label for="hour2">الساعة</label>
                        <input type="number" dir="ltr" id="hour2" v-model="hour2" min="0" max="23" placeholder="00" inputmode="numeric">
                    </div>
                    <div class="time-field" style="direction: rtl;">
                        <label for="minute2">الدقيقة</label>
                        <input type="number" dir="ltr" id="minute2" v-model="minute2" min="0" max="59" placeholder="00" inputmode="numeric">
                    </div>
                    <div class="time-field" style="direction: rtl;">
                        <label for="second2">الثانية</label>
                        <input type="number" dir="ltr" id="second2" v-model="second2" min="0" max="59" placeholder="00" inputmode="numeric">
                    </div>
                </div>
            </div>
        </div>

        <div class="time-hint">
            الساعات من 0 إلى 23، والدقائق من 0 إلى 59. الثواني اختيارية؛ إذا تُرك حقل الثواني فارغًا فستُحسب قيمته صفرًا ولن تُذكر الثواني في النتيجة.
        </div>

        <button class="calc" @click="handleCalculate">احسب الفرق</button>
        <div v-show="errorMessage" class="error">{{ errorMessage }}</div>
    </div>

    <div v-show="resultsShown" class="card time-results">
        <div class="time-result-banner">{{ resultBanner }}</div>

        <div class="time-difference-title">الفرق بين الوقتين:</div>

        <div class="time-result-row">
            <span class="lbl">بالساعات:</span>
            <span class="val">{{ hoursMinutesText }}</span>
        </div>

        <div class="time-result-row">
            <span class="lbl">بالدقائق:</span>
            <span class="val">{{ minutesText }}</span>
        </div>

        <div class="time-result-row" v-show="showSecondsRow">
            <span class="lbl">بالثواني:</span>
            <span class="val">{{ secondsText }}</span>
        </div>

        <div class="time-note">{{ dayNote }}</div>
    </div>

    <AdSpace />
</template>

<style scoped>
.time-pair{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
}
.time-box{
  padding:16px;
  border:1px solid var(--border);
  border-radius:12px;
  background:rgba(15,23,42,.45);
}
.time-box h2{
  font-size:1rem;
  margin:0 0 14px;
  text-align:center;
}
.time-fields{
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  gap:10px;
}
.time-field label{
  display:block;
  font-size:.8rem;
  color:var(--muted);
  margin-bottom:6px;
  text-align:center;
}
.time-field input{
  width:100%;
  padding:11px 8px;
  border-radius:8px;
  border:1px solid var(--border);
  background:#0f172a;
  color:var(--text);
  font-size:1.05rem;
  text-align:center;
}
.time-field input:focus{
  outline:2px solid var(--accent);
}
.time-field input::placeholder{
  color:var(--muted);
  opacity:.7;
}
.time-hint{
  font-size:.75rem;
  color:var(--muted);
  margin-top:10px;
  line-height:1.6;
}
/*.time-results{
  display:none;
}*/
.time-result-banner{
  padding:16px;
  border-radius:12px;
  text-align:center;
  background:linear-gradient(90deg,rgba(56,189,248,.15),rgba(167,139,250,.15));
  border:1px solid var(--accent);
  font-weight:bold;
  font-size:1.1rem;
  margin-bottom:14px;
}
.time-difference-title{
  text-align:center;
  font-size:1rem;
  margin:8px 0 12px;
}
.time-result-row{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:14px 16px;
  border:1px solid var(--border);
  border-radius:10px;
  margin-bottom:10px;
  background:#0f172a;
}
.time-result-row .lbl{
  color:var(--muted);
  font-size:.85rem;
}
.time-result-row .val{
  font-weight:bold;
  font-size:1.05rem;
}
.time-note{
  font-size:.75rem;
  color:var(--muted);
  margin-top:8px;
  text-align:center;
  line-height:1.6;
}
@media (max-width:700px){
  .time-pair{grid-template-columns:1fr;}
}
@media (max-width:420px){
  .time-fields{gap:7px;}
  .time-field input{font-size:1rem;padding:10px 5px;}
}

</style>