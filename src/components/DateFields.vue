<template>
  <div class="fields">
    <div class="field">
      <label>اليوم</label>
      <input type="number" :min="1" :max="currentMaxDay" v-model.number="dateData.day" style="direction:ltr">
    </div>
    
    <div class="field">
      <label>الشهر</label>
      <!-- يظهر ويختفي بناءً على نظام التقويم المختار -->
      <select v-if="system !== 'hijri'" v-model="dateData.month">
        <option v-for="(name, i) in gregorianMonths" :key="i" :value="i + 1">
          {{ i + 1 }} - {{ name }}
        </option>
      </select>
      <select v-else v-model="dateData.month">
        <option v-for="(name, i) in hijriMonths" :key="i" :value="i + 1">
          {{ i + 1 }} - {{ name }}
        </option>
      </select>
    </div>

    <div class="field">
      <label>السنة</label>
      <input type="number" v-model.number="dateData.year" style="direction:ltr">
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useCalendar } from '../composables/useCalendar'

const props = defineProps(['system', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

const { gregorianMonths, hijriMonths } = useCalendar()

// ربط البيانات بشكل كائن (Object) يحتوي على اليوم والشهر والسنة
const dateData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const currentMaxDay = computed(() => props.system === 'hijri' ? 30 : 31)
</script>
