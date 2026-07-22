<script setup>
defineProps({
  student: {
    type: Object,
    required: true,
  },
})

defineEmits(['close'])
</script>

<template>
  <aside class="student-popup" aria-live="polite">
    <button class="student-popup__close" type="button" aria-label="关闭同学资料" @click="$emit('close')">
      ×
    </button>
    <div class="student-popup__heading">
      <span>{{ student.name.slice(-1) }}</span>
      <div>
        <p>CLASS 2321</p>
        <h2>{{ student.name }}</h2>
      </div>
    </div>
    <dl>
      <div>
        <dt>大学</dt>
        <dd>{{ student.school }}</dd>
      </div>
      <div>
        <dt>专业</dt>
        <dd>{{ student.major }}</dd>
      </div>
      <div>
        <dt>城市</dt>
        <dd>{{ student.province }} · {{ student.city }}</dd>
      </div>
    </dl>
    <p v-if="student.message" class="student-popup__message">“{{ student.message }}”</p>
  </aside>
</template>
