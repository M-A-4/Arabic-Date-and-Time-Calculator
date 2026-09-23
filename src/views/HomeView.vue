<script setup>

import PwaButton from '@/components/PwaButton.vue';
import AdSpace from '@/components/AdSpace.vue';
import { useHead, useSeoMeta } from '@unhead/vue';

useSeoMeta({
  title: 'حاسبة التاريخ والوقت - الصفحة الرئيسية',
  description: 'موقع يتيح بعض الحسابات المتعلقة بالتاريخ والوقت'
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://datetimecalcar.netlify.app/' }
  ]
})

const pagesLinks = [
  [' حساب الفرق بين تاريخين', '/date-difference'],
  [' حساب الفرق بين وقتين', '/time-difference'],
  [' حساب يوم الأسبوع والتاريخين الموافقين لتاريخ معطى بإحدى الأنظمة الثلاث', '/date-converter'],
  [' عرض رزنامة الشهر', '/calendar'],
  [' حساب التاريخ بعد أو قبل فترة محددة من تاريخ معين', '/date-calculator'],
  [' حساب الوقت بعد أو قبل فترة محددة من وقت معين', '/time-calculator'],
  
]
</script>

<template>
  <div>
    تتوفر في موقعنا مجموعة من الصفحات التي تتيح إجراء الحسابات المتعلقة بالتاريخ  والوقت، يعتمد موقعنا تنسيق 24 ساعة  للوقت ويتيح التعامل مع ثلاثة أنظمة تاريخ هي الغريغوري (الميلادي) واليولياني (الميلادي الشرقي) وتقويم أم القرى (الهجري الرسمي)
  </div>
  <div>
    ملاحظة: قد يختلف تاريخ تقويم أم القرى عن التقويم الهجري الشرعي بمقدار يوم واحد زيادةً أو نقصاناً
  </div><br>
  <PwaButton />
  <div v-for="page in pagesLinks" class="card" style="text-align: center;">
    <RouterLink :to="page[1]">{{  page[0]  }}</RouterLink>
  </div>
  <AdSpace />
</template>

<style>

</style>
