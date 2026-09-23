<script setup>
//import {ref} from 'vue'
// import Menu from './Menu.vue'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => route.meta.title || 'حاسبة التاريخ والوقت')

/*
const isMenuVisible = ref(false)
function toggleMenu (){
    isMenuVisible.value = !isMenuVisible.value
    //console.log(isMenuVisible)
}
*/
</script>

<template>
    <h1>{{  pageTitle  }}</h1><br>
    
</template>

<style scoped>
 #menbut{
    aspect-ratio:1/1;
    width:100%;
    height:100%;
 }
 td,h1{
    text-align:center;
 }
</style>