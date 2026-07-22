const TWO_PI = Math.PI * 2

/**
 * 只改变标记的显示坐标，原始 lng/lat 始终保留在学生数据中。
 * 同城第一位位于城市中心，其余同学均匀分布在小圆环上。
 */
export function layoutStudentMarkers(students) {
  const cityGroups = new Map()

  students.forEach((student) => {
    const key = `${student.province}::${student.city}`
    const group = cityGroups.get(key) || []
    group.push(student)
    cityGroups.set(key, group)
  })

  return [...cityGroups.values()].flatMap((group) => {
    if (group.length === 1) {
      const student = group[0]
      return [{ ...student, displayLng: student.lng, displayLat: student.lat }]
    }

    const radius = Math.min(0.34, 0.13 + group.length * 0.018)

    return group.map((student, index) => {
      const angle = -Math.PI / 2 + (index / group.length) * TWO_PI
      const latitudeScale = Math.max(0.72, Math.cos((student.lat * Math.PI) / 180))

      return {
        ...student,
        displayLng: student.lng + (Math.cos(angle) * radius) / latitudeScale,
        displayLat: student.lat + Math.sin(angle) * radius,
      }
    })
  })
}
