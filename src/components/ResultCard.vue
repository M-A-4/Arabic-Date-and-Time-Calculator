<script setup>
defineProps({
    label:{
        type: String,
        required: true
    },
    modelValue:{
        type: String,
        default: () => ''
    }
});
defineEmits(['update:modelValue']);
</script>

<template>
    <div class="result-row">
        <span class="lbl">{{  label  }}</span><span class="val">{{  modelValue  }}</span>
    </div>
</template>