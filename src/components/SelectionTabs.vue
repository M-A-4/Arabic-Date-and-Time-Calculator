<template>
    <div class="system-tabs">
        <label v-for="tab in options" :key="tab.value" :class="{'active-tab' : modelValue === tab.value}">
            <input type="radio" :value="tab.value" :checked="modelValue === tab.value" @change="$emit('update:modelValue', tab.value)">
            <span>{{  tab.label  }}</span>
        </label>
    </div>
</template>

<script setup>

defineProps({
    modelValue: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        default: () => []
    }
});
defineEmits(['update:modelValue']);
</script>