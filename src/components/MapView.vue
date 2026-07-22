<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import { EffectScatterChart, ScatterChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import chinaGeoJsonUrl from '../assets/map/china-provinces.json?url'
import { layoutStudentMarkers } from '../utils/markerLayout'
import MapControls from './MapControls.vue'
import StudentPopup from './StudentPopup.vue'

const props = defineProps({
  students: {
    type: Array,
    required: true,
  },
  selectedStudentId: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['select-student', 'clear-selection'])

const MAP_NAME = 'china-provinces'
const FONT_STACK = '"Noto Sans SC Variable", system-ui, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "PingFang SC", sans-serif'
const INITIAL_CENTER = [104.2, 36.2]
const INITIAL_ZOOM = 1.08
const FOCUS_ZOOM = 2.85

const chartElement = ref(null)
const isReady = ref(false)
const mapError = ref('')
const laidOutStudents = computed(() => layoutStudentMarkers(props.students))
const selectedStudent = computed(
  () => props.students.find((student) => student.id === props.selectedStudentId) || null,
)

let chart = null
let resizeObserver = null

echarts.use([GeoComponent, TooltipComponent, ScatterChart, EffectScatterChart, CanvasRenderer])

const clampZoom = (zoom) => Math.min(6, Math.max(0.8, zoom))

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      })[character],
  )
}

function toSeriesData(studentList) {
  return studentList.map((student) => ({
    id: student.id,
    name: student.name,
    value: [student.displayLng, student.displayLat, 1],
    student,
  }))
}

function getView() {
  const geo = chart?.getOption()?.geo?.[0]

  return {
    center: geo?.center || INITIAL_CENTER,
    zoom: Number(geo?.zoom) || INITIAL_ZOOM,
  }
}

function setZoom(multiplier) {
  if (!chart) return
  const view = getView()

  chart.setOption({
    geo: {
      center: view.center,
      zoom: clampZoom(view.zoom * multiplier),
    },
  })
}

function resetView() {
  if (!chart) return

  chart.hideLoading()
  chart.dispatchAction({ type: 'hideTip' })
  chart.setOption({
    geo: {
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    },
  })
}

function focusStudent(studentId) {
  if (!chart || !isReady.value) return
  const marker = laidOutStudents.value.find((student) => student.id === studentId)
  if (!marker) return

  chart.setOption({
    geo: {
      center: [marker.displayLng, marker.displayLat],
      zoom: Math.max(getView().zoom, FOCUS_ZOOM),
    },
  })
  chart.dispatchAction({ type: 'hideTip' })
}

function syncResponsiveMapStyle() {
  if (!chart || !chartElement.value) return
  const compact = chartElement.value.clientWidth < 520

  chart.setOption({
    geo: {
      label: {
        show: !compact,
      },
      emphasis: {
        label: {
          show: !compact,
        },
      },
    },
    series: [
      {
        id: 'student-markers',
        symbolSize: compact ? 34 : 38,
        label: {
          distance: compact ? 2 : 4,
          fontSize: compact ? 10 : 11,
        },
      },
      {
        id: 'selected-marker',
        symbolSize: compact ? 41 : 45,
      },
    ],
  })
}

function updateMarkerSeries() {
  if (!chart) return

  const allMarkers = toSeriesData(laidOutStudents.value)
  const activeMarkers = allMarkers.filter((item) => item.id === props.selectedStudentId)

  chart.setOption({
    series: [
      {
        id: 'student-markers',
        data: allMarkers,
      },
      {
        id: 'selected-marker',
        data: activeMarkers,
      },
    ],
  })
}

function buildOption() {
  return {
    backgroundColor: 'transparent',
    animationDuration: 700,
    animationDurationUpdate: 520,
    animationEasingUpdate: 'cubicOut',
    tooltip: {
      trigger: 'item',
      confine: true,
      enterable: false,
      padding: 0,
      borderWidth: 0,
      backgroundColor: 'transparent',
      extraCssText: 'box-shadow:none;',
      formatter(parameters) {
        const student = parameters.data?.student
        if (!student) return ''

        return `
          <div class="map-tooltip">
            <strong>${escapeHtml(student.name)}</strong>
            <span>${escapeHtml(student.school)}</span>
            <span>${escapeHtml(student.major)}</span>
            <span>📍 ${escapeHtml(student.province)} · ${escapeHtml(student.city)}</span>
            ${student.message ? `<em>${escapeHtml(student.message)}</em>` : ''}
          </div>
        `
      },
    },
    geo: {
      map: MAP_NAME,
      roam: true,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      scaleLimit: {
        min: 0.8,
        max: 6,
      },
      layoutCenter: ['50%', '51%'],
      layoutSize: '96%',
      silent: false,
      selectedMode: false,
      label: {
        show: true,
        color: '#695845',
        fontFamily: FONT_STACK,
        fontSize: 10,
        lineHeight: 12,
      },
      itemStyle: {
        areaColor: '#e7d3b0',
        borderColor: '#8b7054',
        borderWidth: 1.15,
        shadowColor: 'rgba(88, 61, 37, 0.08)',
        shadowBlur: 2,
      },
      emphasis: {
        label: {
          show: true,
          color: '#4f3928',
          fontWeight: 700,
        },
        itemStyle: {
          areaColor: '#f1dfbc',
          borderColor: '#6f5038',
          borderWidth: 1.4,
        },
      },
    },
    series: [
      {
        id: 'student-markers',
        name: '同学位置',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: toSeriesData(laidOutStudents.value),
        symbol: 'pin',
        symbolSize: 38,
        itemStyle: {
          color: '#b44d3b',
          borderColor: '#fff8ef',
          borderWidth: 1.4,
          shadowColor: 'rgba(103, 45, 34, 0.28)',
          shadowBlur: 7,
        },
        emphasis: {
          scale: 1.13,
          itemStyle: {
            color: '#923829',
            borderWidth: 2,
          },
        },
        label: {
          show: true,
          formatter: ({ data }) => data.name,
          position: 'right',
          distance: 4,
          color: '#4a382e',
          fontFamily: FONT_STACK,
          fontSize: 11,
          fontWeight: 700,
          backgroundColor: 'rgba(255, 253, 249, 0.88)',
          borderColor: 'rgba(195, 175, 151, 0.75)',
          borderWidth: 1,
          borderRadius: 4,
          padding: [3, 5],
        },
        labelLayout: {
          hideOverlap: true,
        },
        z: 5,
      },
      {
        id: 'selected-marker',
        name: '当前同学',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: [],
        symbol: 'pin',
        symbolSize: 45,
        showEffectOn: 'render',
        rippleEffect: {
          period: 5,
          scale: 2.1,
          brushType: 'stroke',
        },
        itemStyle: {
          color: '#8f382b',
          borderColor: '#fff8ef',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        tooltip: {
          show: false,
        },
        z: 8,
      },
    ],
  }
}

watch(
  () => props.students,
  () => updateMarkerSeries(),
  { deep: true },
)

watch(
  () => props.selectedStudentId,
  (studentId) => {
    updateMarkerSeries()
    if (studentId !== null) focusStudent(studentId)
    else chart?.dispatchAction({ type: 'hideTip' })
  },
)

onMounted(async () => {
  try {
    await nextTick()
    const response = await fetch(chinaGeoJsonUrl)
    if (!response.ok) throw new Error(`GeoJSON 加载失败：${response.status}`)

    const chinaGeoJson = await response.json()
    echarts.registerMap(MAP_NAME, chinaGeoJson)
    chart = echarts.init(chartElement.value, null, { renderer: 'canvas' })
    chart.setOption(buildOption())

    chart.on('click', (parameters) => {
      if (parameters.seriesId === 'student-markers' && parameters.data?.student) {
        emit('select-student', parameters.data.student)
        chart.dispatchAction({ type: 'hideTip' })
      } else if (parameters.componentType === 'geo') {
        emit('clear-selection')
      }
    })

    chart.getZr().on('click', (event) => {
      if (!event.target) emit('clear-selection')
    })

    resizeObserver = new ResizeObserver(() => {
      chart?.resize()
      syncResponsiveMapStyle()
    })
    resizeObserver.observe(chartElement.value)
    syncResponsiveMapStyle()
    isReady.value = true

    if (props.selectedStudentId !== null) focusStudent(props.selectedStudentId)
  } catch (error) {
    mapError.value = '本地地图数据加载失败，请重新启动开发服务器。'
    console.error(error)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
})

defineExpose({ focusStudent, resetView })
</script>

<template>
  <div class="map-view">
    <div ref="chartElement" class="map-canvas" role="img" aria-label="具有真实省级边界和同学标记的中国地图"></div>

    <div class="map-status" :class="{ 'map-status--ready': isReady, 'map-status--error': mapError }">
      <span aria-hidden="true"></span>
      {{ mapError || (isReady ? `本地地图 · ${students.length} 个标记` : '地图初始化中') }}
    </div>

    <MapControls
      @zoom-in="setZoom(1.25)"
      @zoom-out="setZoom(0.8)"
      @reset="resetView"
    />

    <Transition name="popup">
      <StudentPopup v-if="selectedStudent" :student="selectedStudent" @close="$emit('clear-selection')" />
    </Transition>

    <div class="map-caption">
      <strong>全国视角</strong>
      <span>点击标记查看资料 · 拖动地图 · 滚轮缩放</span>
    </div>
  </div>
</template>
