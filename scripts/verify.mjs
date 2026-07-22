import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { students } from '../src/data/students.js'
import { layoutStudentMarkers } from '../src/utils/markerLayout.js'
import { filterStudents } from '../src/utils/studentFilters.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function collectSourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return collectSourceFiles(fullPath)
    return /\.(?:js|vue|css|html)$/.test(entry.name) ? [fullPath] : []
  })
}

const requiredStudentFields = [
  'id',
  'name',
  'school',
  'major',
  'province',
  'city',
  'lng',
  'lat',
  'message',
]

assert(students.length > 0, '学生数据不能为空')
assert(new Set(students.map((student) => student.id)).size === students.length, '学生 id 必须唯一')

students.forEach((student) => {
  requiredStudentFields.forEach((field) => assert(field in student, `${student.id} 缺少字段 ${field}`))
  assert(Number.isFinite(student.lng) && student.lng >= 73 && student.lng <= 136, `${student.name} 经度异常`)
  assert(Number.isFinite(student.lat) && student.lat >= 3 && student.lat <= 54, `${student.name} 纬度异常`)
})

assert(filterStudents(students, '武汉').length > 0, '城市搜索检查失败')
assert(filterStudents(students, '自动化').length > 0, '专业搜索检查失败')
assert(filterStudents(students, '牛肉面').length > 0, '备注搜索检查失败')
assert(filterStudents(students, '', '湖北省').length > 0, '省份筛选检查失败')
assert(filterStudents(students, '华中', '湖北省').length > 0, '组合筛选检查失败')

const originalStudents = JSON.stringify(students)
const cityCounts = students.reduce((counts, student) => {
  const key = `${student.province}::${student.city}`
  counts.set(key, (counts.get(key) || 0) + 1)
  return counts
}, new Map())
const duplicateCityKey = [...cityCounts.entries()].find(([, count]) => count > 1)?.[0]
assert(duplicateCityKey, '未找到用于检验的同城记录')
const duplicateCityMarkers = layoutStudentMarkers(students).filter(
  (student) => `${student.province}::${student.city}` === duplicateCityKey,
)
assert(
  new Set(duplicateCityMarkers.map((student) => `${student.displayLng},${student.displayLat}`)).size === duplicateCityMarkers.length,
  '同城标记仍然重叠',
)
assert(JSON.stringify(students) === originalStudents, '标记布局修改了原始学生坐标')

const geoJsonPath = path.join(root, 'src/assets/map/china-provinces.json')
const geoJson = JSON.parse(fs.readFileSync(geoJsonPath, 'utf8'))
const regionNames = new Set(geoJson.features.map((feature) => feature.properties?.name).filter(Boolean))
const requiredRegions = ['北京市', '天津市', '上海市', '重庆市', '海南省', '台湾省', '香港特别行政区', '澳门特别行政区']

assert(geoJson.type === 'FeatureCollection', '地图文件不是 GeoJSON FeatureCollection')
assert(geoJson.features.length === 35, '地图要素数量异常')
requiredRegions.forEach((region) => assert(regionNames.has(region), `地图缺少 ${region}`))

const sourceFiles = [
  path.join(root, 'index.html'),
  ...collectSourceFiles(path.join(root, 'src')),
]
const sourceText = sourceFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n')
const forbiddenPatterns = [
  /navigator\.geolocation/i,
  /\bGeolocation\b/,
  /getCurrentPosition\s*\(/,
  /hm\.baidu\.com/i,
  /google-analytics/i,
  /geo\.datav\.aliyun\.com/i,
  /api\.map\.baidu\.com/i,
  /webapi\.amap\.com/i,
  /map\.qq\.com/i,
]

forbiddenPatterns.forEach((pattern) => assert(!pattern.test(sourceText), `发现禁止的运行时依赖：${pattern}`))

console.log('✓ 学生数据结构与坐标')
console.log('✓ 搜索、省份筛选与组合筛选')
console.log('✓ 同城错位且原始坐标不变')
console.log('✓ 本地省级 GeoJSON 与必要行政区')
console.log('✓ 无定位、统计追踪或在线地图 API')
