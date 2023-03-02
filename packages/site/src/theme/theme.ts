import type {GlobalThemeOverrides} from 'naive-ui'
import {type Ref,ref} from 'vue'
export const theme: Ref<GlobalThemeOverrides> = ref({
  Layout: {'color': '#F2F2F2'},
  Card: {'color': 'transparent',},
  Button: {
    textColor: '#737373',
    textColorHover: '#404040',
    borderFocus: '1px #404040 solid',
    textColorPrimary: '#404040',
    colorPrimary: '#F2F2F2',
    colorHoverPrimary: '#737373'
  }
})