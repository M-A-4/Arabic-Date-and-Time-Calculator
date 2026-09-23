<script setup>
// 1. استقبال حالة الفتح والإغلاق من المكون الأب
defineProps({
  isOpen: Boolean
})

// 2. قاموس الروابط والنصوص (Smart Links Dictionary)
const menuLinks = [
  { text: 'الصفحة الرئيسية', url: '/' },
  { text: 'حول الموقع', url: '/about' },
  //{ text: 'إحصائيات الروابط', url: '/analytics' },
  //{ text: 'إعدادات الحساب', url: '/settings' }
]
</script>

<template>
  <!-- يتم إظهار أو إخفاء القائمة بناءً على الـ Prop القادم من الخارج -->
  <div v-if="isOpen" class="smart-menu">
    <ul>
      <!-- عرض الروابط ذكياً من القاموس -->
      <li v-for="(link, index) in menuLinks" :key="index">
        <router-link :to="link.url">{{ link.text }}</router-link>
      </li>
    </ul>
    
  </div>
</template>

<style scoped>
/* تنسيق بسيط للقائمة */
.smart-menu {
  /*position: absolute;
  top: 60px;
  right: 20px; */
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 15px;
  border-radius: 8px;
  /*width: clamp(70%,200px,100%);*/
  width: 100%;
  text-align: center;
}
.smart-menu ul { list-style: none; padding: 0; margin: 0; }
.smart-menu li { margin-bottom: 10px; }
.smart-menu a { text-decoration: none; color: #333; }
.smart-menu a:hover { color: #42b883; }
</style>
