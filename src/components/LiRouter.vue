<script setup>
defineProps({
  theLink: String,
  theTitle: String
})
</script>

<template>
    <li>
        <div>
            <RouterLink :to="theLink">{{  theTitle  }}</RouterLink>
        </div>
        <div>
            <slot></slot>
        </div>
    </li>
</template>

<style scoped></style>