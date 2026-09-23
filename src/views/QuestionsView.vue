<script setup>
import LiExplainer from '@/components/LiExplainer.vue';
import { useHead, useSeoMeta } from '@unhead/vue';

useSeoMeta({
  title: 'أسئلة وإجابات حول موقع حاسبة التاريخ والوقت',
  description: "أسئلة وإجابات حول موقع حاسبة التاريخ والوقت، كيف يمكنني التحويل بين التاريخ الميلادي والهجري؟  كيف أحسب تاريخ ولادتي بالهجري أو يوم الأسبوع الذي ولدت فيه؟  كيف أحسب عمري بالأيام؟  كيف أعرف التاريخ الدقيق لليوم القادم بعد عدد محدد من الأيام؟"
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://datetimecalcar.netlify.app/questions-and-answers' }
  ]
})
</script>

<template>
    <ul>
        <LiExplainer the-title="كيف يمكنني التحويل بين التاريخ الميلادي والهجري؟ ">
            <span>
              ادخل إلى صفحة 
            </span><RouterLink to="/date-converter">
              "محول التاريخ"
            </RouterLink><span>
              واختر النظام الذي تريد التحويل منه ثم أدخل التاريخ واضغط "احسب التاريخ"
            </span>
        </LiExplainer>
        <LiExplainer the-title=" كيف أحسب تاريخ ولادتي بالهجري أو يوم الأسبوع الذي ولدت فيه؟">
            <span>
              ادخل صفحة 
            </span><RouterLink to="/date-converter">
              "محول التاريخ"
            </RouterLink><span>
              وأدخل تاريخ ميلادك ثم اضغط "احسب التاريخ"
            </span>
        </LiExplainer>
        <LiExplainer the-title="كيف أحسب عمري بالأيام؟ ">
            <span>
              ادخل صفحة 
            </span><RouterLink to="/date-calculator">
              "حاسبة الفرق بين تاريخين" 
            </RouterLink><span>
              وأدخل يوم ولادتك كتاريخ أول واليوم الحالي كتاريخ ثاني ثم اضغط "قارن التاريخين"
            </span>
        </LiExplainer>
        <LiExplainer the-title=" كيف أعرف التاريخ الدقيق لليوم القادم بعد 50 يوم؟ ">
            <span>
              ادخل 
            </span><RouterLink to="/date-calculator">
              "حاسبة التاريخ"
            </RouterLink><span>
              وأدخل تاريخ اليوم وأدخل وحدة الفرق "أيام" واكتب 50 في حقل الإدخال ثم اضغط "احسب التاريخ"
            </span>
        </LiExplainer>
        <LiExplainer the-title=" هل يمكنني استخدام الموقع لمعرفة متى يبدأ صيام شهر رمضان؟ ">
             الموقع يعطيك بداية شهر رمضان بالتقويم الرسمي لدول الخليج العربي لكن لمعرفة البداية الشرعية لشهر رمضان عليك انتظار رؤية الهلال، وقد تتأخر البداية الشرعية عن البداية الرسمية بمقدار يوم واحد أو تتأخر عنها بمقدار يوم واحد
        </LiExplainer>
    </ul>
</template>

<style scoped></style>