/**
 * 中国时区时间工具（UTC+8）
 * 统一使用此模块，确保所有时间相关操作一致
 */

// 获取当前中国时区时间
export function getChinaDate() {
  const now = new Date()
  const offset = 8 // 中国时区 UTC+8
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + 3600000 * offset)
}

// 获取中国时区日期字符串 (YYYY-MM-DD)
export function getChinaDateString() {
  const d = getChinaDate()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

// 获取中国时区日期时间字符串 (YYYY-MM-DD HH:mm:ss)
export function getChinaDateTimeString() {
  const d = getChinaDate()
  const pad = (n) => String(n).padStart(2, '0')
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
}

// 将任意日期字符串（如数据库返回的 UTC 时间）转换为中国时区 Date 对象
export function toChinaDate(dateStr) {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  // 假设输入是 UTC 或带时区，直接返回中国时区偏移
  const offset = 8
  const utc = d.getTime() + d.getTimezoneOffset() * 60000
  return new Date(utc + 3600000 * offset)
}

// 格式化显示日期（中国时区）
export function formatChinaDate(dateStr) {
  const d = toChinaDate(dateStr)
  if (!d) return ''
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

export function formatChinaDateTime(dateStr) {
  const d = toChinaDate(dateStr)
  if (!d) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
}