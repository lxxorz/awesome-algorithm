export type Widget = {
  height: number
  width: number
}

// 用于排序的项
export type SortItem = {
  id: number | string
  value: number                     // 用于排序的值
  label: string | number           // 页面上实际显示的文本值
}