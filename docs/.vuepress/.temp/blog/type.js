      export const typesMap = {"article":{"/":{"path":"/article/","indexes":[12,8,9,10,0,1,2,3,4,5,6,7,11]}},"timeline":{"/":{"path":"/timeline/","indexes":[12,8,9,10,0,1,2,3,4,5,6,7,11]}}};
      
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });

      