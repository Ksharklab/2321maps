<script setup>
import StudentCard from './StudentCard.vue'

defineProps({
  students: {
    type: Array,
    required: true,
  },
  selectedStudentId: {
    type: Number,
    default: null,
  },
})

defineEmits(['select-student'])
</script>

<template>
  <div v-if="students.length" class="student-list" aria-label="同学名单">
    <StudentCard
      v-for="student in students"
      :key="student.id"
      :student="student"
      :selected="student.id === selectedStudentId"
      @select="$emit('select-student', student)"
    />
  </div>
  <div v-else class="student-empty" role="status">
    <span aria-hidden="true">⌕</span>
    <strong>没有找到匹配的同学</strong>
    <p>可以换个关键词，或选择其他省份。</p>
  </div>
</template>
