<template>
  <div class="system-tabs">
    <label :class="{ 'active-tab': modelValue==='gregorian' }">
      <input type="radio" value="gregorian" :checked="modelValue === 'gregorian'" @change="$emit('update:modelValue', 'gregorian')">
      <span>غريغوري (ميلادي)</span>
    </label>
    <label :class="{ 'active-tab': modelValue==='julian' }">
      <input type="radio" value="julian" :checked="modelValue === 'julian'" @change="$emit('update:modelValue', 'julian')">
      <span>يولياني</span>
    </label>
    <label :class="{ 'active-tab': modelValue==='hijri' }">
      <input type="radio" value="hijri" :checked="modelValue === 'hijri'" @change="$emit('update:modelValue', 'hijri')">
      <span>هجري (أم القرى)</span>
    </label>
  </div>
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>
