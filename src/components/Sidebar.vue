<script setup>
import { computed } from 'vue'
import ProvinceFilter from './ProvinceFilter.vue'
import SearchBar from './SearchBar.vue'
import StudentList from './StudentList.vue'

const props = defineProps({
  students: {
    type: Array,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
  provinces: {
    type: Array,
    required: true,
  },
  query: {
    type: String,
    default: '',
  },
  province: {
    type: String,
    default: '',
  },
  selectedStudentId: {
    type: Number,
    default: null,
  },
})

const cityCount = computed(() => new Set(props.students.map((student) => student.city)).size)

defineEmits(['update:query', 'update:province', 'select-student'])
</script>

<template>
  <aside class="sidebar">
    <header class="sidebar__header">
      <p class="eyebrow">CLASS 2321 · 录取去向</p>
      <h1>2321班全国<br />蹭饭地图 <span aria-hidden="true">🍚</span></h1>
      <p class="subtitle">心如草木，向阳而生</p>
    </header>

    <div class="privacy-note" role="note">
      <span class="privacy-note__icon" aria-hidden="true">✓</span>
      <p>班级名单版本：信息由班级提供的去向表整理，仅供班级内部交流。</p>
    </div>

    <section class="summary-card" aria-label="名单统计">
      <div>
        <strong>{{ students.length }}</strong>
        <span>{{ students.length === totalCount ? '位同学' : `／ ${totalCount} 位` }}</span>
      </div>
      <i aria-hidden="true"></i>
      <div>
        <strong>{{ cityCount }}</strong>
        <span>个城市</span>
      </div>
    </section>

    <div class="filter-tools" aria-label="名单筛选工具">
      <SearchBar :model-value="query" @update:model-value="$emit('update:query', $event)" />
      <ProvinceFilter
        :model-value="province"
        :provinces="provinces"
        @update:model-value="$emit('update:province', $event)"
      />
    </div>

    <div class="list-heading">
      <h2>同学名单</h2>
      <span>名单数据</span>
    </div>

    <StudentList
      :students="students"
      :selected-student-id="selectedStudentId"
      @select-student="$emit('select-student', $event)"
    />

    <footer class="sidebar__footer">
      当前使用班级去向表 · 不采集访问者位置
    </footer>
  </aside>
</template>
