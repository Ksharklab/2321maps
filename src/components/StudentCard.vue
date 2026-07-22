<script setup>
defineProps({
  student: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])
</script>

<template>
  <button
    type="button"
    class="student-card"
    :class="{ 'student-card--selected': selected }"
    :aria-pressed="selected"
    @click="$emit('select')"
  >
    <div class="student-card__avatar" aria-hidden="true">{{ student.name.slice(-1) }}</div>
    <div class="student-card__body">
      <h3>{{ student.name }}</h3>
      <p>{{ student.school }} · {{ student.province }} {{ student.city }}</p>
      <span>{{ student.major }}</span>
    </div>
    <span class="student-card__arrow" aria-hidden="true">›</span>
  </button>
</template>
