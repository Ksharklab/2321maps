<script setup>
defineEmits(['zoom-in', 'zoom-out', 'reset'])
</script>

<template>
  <div class="map-controls" aria-label="地图缩放控制">
    <button type="button" title="放大地图" aria-label="放大地图" @click="$emit('zoom-in')">+</button>
    <button type="button" title="缩小地图" aria-label="缩小地图" @click="$emit('zoom-out')">−</button>
    <button class="map-controls__reset" type="button" title="恢复全国视角" @click="$emit('reset')">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.9 7.4A8.2 8.2 0 1 1 4 14m.9-6.6V3m0 4.4h4.4" />
      </svg>
      <span>复位</span>
    </button>
  </div>
</template>
