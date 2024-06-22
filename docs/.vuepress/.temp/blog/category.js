export const categoriesMap = {"category":{"/":{"path":"/category/","map":{"CategoryA":{"path":"/category/categorya/","indexes":[0,1,2,3,4,5,6,7,8,9,10,11,12]},"잡담":{"path":"/category/%EC%9E%A1%EB%8B%B4/","indexes":[12]},"CategoryB":{"path":"/category/categoryb/","indexes":[0,1,2,3,4,5,6,8,9,10]}}}},"tag":{"/":{"path":"/tag/","map":{"tag A":{"path":"/tag/tag-a/","indexes":[3,4,5,6,7,11,12]},"tag B":{"path":"/tag/tag-b/","indexes":[3,4,5,6,7,11,12]},"tag C":{"path":"/tag/tag-c/","indexes":[0,1,2,8,9,10]},"tag D":{"path":"/tag/tag-d/","indexes":[0,1,2,8,9,10]}}}}};

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });

