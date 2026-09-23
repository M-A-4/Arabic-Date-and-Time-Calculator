<script setup>
defineProps({
    modelValue:{
        type: Number,
        default: () => 0
    },
    label:{
        type: String,
        default: () => ''
    },
    min:{
        type: Number,
        default: () => 0
    }
});
defineEmits(['update:modelValue']);
</script>

<template>
    <div class="field">
        <label>
            <span>{{  label  }}</span>
            <input type="number" :min="min" :value="modelValue" @input="$emit('update:modelValue', $event.target.valueAsNumber)" style="direction:ltr">
        </label>
    </div>
</template>