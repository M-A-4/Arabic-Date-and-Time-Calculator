<script setup>
import { useHead, useSeoMeta } from '@unhead/vue';

useSeoMeta({
  title: 'التواصل مع مطور موقع حاسبة التاريخ والوقت',
  description: "أسئلة وإجابات حول موقع حاسبة التاريخ والوقت، كيف يمكنني التحويل بين التاريخ الميلادي والهجري؟  كيف أحسب تاريخ ولادتي بالهجري أو يوم الأسبوع الذي ولدت فيه؟  كيف أحسب عمري بالأيام؟  كيف أعرف التاريخ الدقيق لليوم القادم بعد عدد محدد من الأيام؟"
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://datetimecalcar.netlify.app/contact' }
  ]
})

const accounts = [
    [
        'عبر تيليجرام',
        '@m_a2194',
        'https://t.me/m_a2194'
    ],
    [
        'عبر البريد الإلكتروني',
        'morhafali.sy@gmail.com',
        'MAILTO:morhafali.sy@gmail.com'
    ],
    [
        'عبر خمسات',
        'morhaf_ali',
        'https://khamsat.com/user/morhaf_ali'
    ]
]
</script>

<template>
    <div>
        تم إنشاء هذا الموقع من قبل مطور الويب "مرهف علي" ، يمكنك التواصل عبر إحدى الوسائل التالية:
    </div><br>
    <div class="card" v-for="account in accounts">
        <div>
            {{  account[0]  }}
        </div><br>
        <div style="direction: ltr;">
            <a :href="account[2]" rel="nofollow">
                {{  account[1]  }}
            </a>
        </div>
    </div>
</template>

<style scoped></style>