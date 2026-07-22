<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="search-bar">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="m16 16 4.2 4.2" />
    </svg>
    <input
      type="search"
      :value="modelValue"
      placeholder="姓名、大学、专业、城市……"
      aria-label="搜索同学"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      v-if="modelValue"
      type="button"
      aria-label="清空搜索"
      title="清空搜索"
      @click="$emit('update:modelValue', '')"
    >
      ×
    </button>
  </label>
</template>
