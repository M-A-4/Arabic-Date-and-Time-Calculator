import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'حاسبة التاريخ والوقت'}
    },
    {
      path: '/explain-datetime-calculator-ar',
      name: 'explain',
      component: () => import('../views/ExplainView.vue'),
      meta: {title: 'شرح كيفية استخدام حاسبة التاريخ والوقت'}
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: {title: 'تواصل مع مطور موقع حاسبة التاريخ والوقت '}
    },
    {
      path: '/questions-and-answers',
      name: 'questions',
      component: () => import('../views/QuestionsView.vue'),
      meta: {title: ' أسئلة وإجابات حول موقع حاسبة التاريخ والوقت'}
    },
    {
      path: '/date-converter',
      name: 'dconverter',
      component: () => import('../views/DateConverter.vue'),
      meta: {title: 'محول التاريخ'}
    },
    {
      path: '/date-difference',
      name: 'ddifference',
      component: () => import('../views/DateDifference.vue'),
      meta: {title: 'الفرق بين تاريخين'}
    },
    {
      path: '/date-calculator',
      name: 'dcalculator',
      component: () => import('../views/DateCalculator.vue'),
      meta: {title: 'حاسبة التاريخ'}
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue'),
      meta: {title: 'رزنامة الشهر'}
    },
    {
      path: '/time-calculator',
      name: 'tcalculator',
      component: () => import('../views/TimeCalculator.vue'),
      meta: {title: 'حاسبة الوقت'}
    },
    {
      path: '/time-difference',
      name: 'tdifference',
      component: () => import('../views/TimeDifference.vue'),
      meta: {title: 'حاسبة الفرق بين وقتين'}
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
      meta: {title: 'خطأ 404'}
    }
  ],
})

export default router
