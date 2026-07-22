<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  provinces: {
    type: Array,
    required: true,
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="province-filter">
    <span class="sr-only">按省份筛选</span>
    <select
      :value="modelValue"
      aria-label="按省份筛选"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">全部省份</option>
      <option v-for="province in provinces" :key="province" :value="province">
        {{ province }}
      </option>
    </select>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 9.5 5 5 5-5" />
    </svg>
  </label>
</template>
