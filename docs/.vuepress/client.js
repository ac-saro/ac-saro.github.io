import {defineClientConfig} from 'vuepress/client'
import Category from './layouts/Category.vue'
import Tag from './layouts/Tag.vue'
import Timeline from './layouts/Timeline.vue'

export default defineClientConfig({
  // we provide some blog layouts
  layouts: {
    Timeline,
    Category,
    Tag,
  },
})
