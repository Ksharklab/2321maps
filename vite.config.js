import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // GitHub Pages 项目站点地址为 https://ksharklab.github.io/2321maps/
  // 静态资源必须带上仓库路径，否则页面会加载为空白。
  base: '/2321maps/',
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/vue/')) return 'vue'
          if (id.includes('/node_modules/zrender/')) return 'zrender'
          if (id.includes('/node_modules/echarts/lib/chart/')) return 'echarts-charts'
          if (id.includes('/node_modules/echarts/lib/component/')) return 'echarts-components'
          if (id.includes('/node_modules/echarts/lib/coord/')) return 'echarts-coordinates'
          if (id.includes('/node_modules/echarts/lib/core/')) return 'echarts-core'
          if (id.includes('/node_modules/echarts/')) return 'echarts-shared'
        },
      },
    },
  },
})
