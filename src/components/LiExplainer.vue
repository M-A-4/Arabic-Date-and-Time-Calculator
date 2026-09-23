<script setup>
defineProps({
  theTitle: String,
})
</script>

<template>
    <li>
        <div>
            <strong> {{  theTitle  }} </strong>
        </div>
        <div>
            <slot></slot>
        </div><br>
    </li>
</template>

<style scoped></style>