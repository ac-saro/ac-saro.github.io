import comp from "C:/Users/core/WebstormProjects/ac-saro.github.io/docs/.vuepress/.temp/pages/posts/article3.html.vue"
const data = JSON.parse("{\"path\":\"/posts/article3.html\",\"title\":\"Article 3\",\"lang\":\"en-US\",\"frontmatter\":{\"date\":\"2022-01-03T00:00:00.000Z\",\"category\":[\"CategoryA\",\"CategoryB\"],\"tag\":[\"tag A\",\"tag B\"]},\"headers\":[{\"level\":2,\"title\":\"Heading 2\",\"slug\":\"heading-2\",\"link\":\"#heading-2\",\"children\":[{\"level\":3,\"title\":\"Heading 3\",\"slug\":\"heading-3\",\"link\":\"#heading-3\",\"children\":[]}]}],\"git\":{\"updatedTime\":1719074929000,\"contributors\":[{\"name\":\"PARK Yong Seo\",\"email\":\"j@saro.me\",\"commits\":2}]},\"filePathRelative\":\"posts/article3.md\",\"excerpt\":\"\\n<h2>Heading 2</h2>\\n<p>Here is the content.</p>\\n<h3>Heading 3</h3>\\n<p>Here is the content.</p>\\n\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
