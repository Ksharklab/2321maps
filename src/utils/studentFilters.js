export function getStudentProvinces(students) {
  return [...new Set(students.map((student) => student.province))].sort((a, b) =>
    a.localeCompare(b, 'zh-CN'),
  )
}

export function filterStudents(students, query = '', province = '') {
  const keyword = query.trim().toLocaleLowerCase('zh-CN')

  return students.filter((student) => {
    const matchesProvince = !province || student.province === province
    const searchableText = [
      student.name,
      student.school,
      student.major,
      student.province,
      student.city,
      student.message,
    ]
      .join(' ')
      .toLocaleLowerCase('zh-CN')

    return matchesProvince && (!keyword || searchableText.includes(keyword))
  })
}
