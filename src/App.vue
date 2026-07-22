<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import MapView from './components/MapView.vue'
import Sidebar from './components/Sidebar.vue'
import { students } from './data/students'
import { filterStudents, getStudentProvinces } from './utils/studentFilters'

const query = ref('')
const province = ref('')
const selectedStudentId = ref(null)
const mapView = ref(null)

const provinces = computed(() => getStudentProvinces(students))
const filteredStudents = computed(() => filterStudents(students, query.value, province.value))

function selectStudent(student) {
  selectedStudentId.value = student.id
  nextTick(() => mapView.value?.focusStudent(student.id))
}

watch(filteredStudents, (visibleStudents) => {
  if (
    selectedStudentId.value !== null &&
    !visibleStudents.some((student) => student.id === selectedStudentId.value)
  ) {
    selectedStudentId.value = null
  }
})
</script>

<template>
  <main class="app-shell">
    <Sidebar
      v-model:query="query"
      v-model:province="province"
      :students="filteredStudents"
      :total-count="students.length"
      :provinces="provinces"
      :selected-student-id="selectedStudentId"
      @select-student="selectStudent"
    />
    <section class="map-panel" aria-label="中国省级地图">
      <MapView
        ref="mapView"
        :students="filteredStudents"
        :selected-student-id="selectedStudentId"
        @select-student="selectStudent"
        @clear-selection="selectedStudentId = null"
      />
    </section>
  </main>
</template>
