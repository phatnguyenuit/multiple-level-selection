let id = 0;
const generateCategories = (
  parentId: number | string,
  length: number,
): Category[] =>
  new Array(length).fill(undefined).map(() => {
    const categoryId = id + 1;
    id += 1;
    return {
      categoryId: `${categoryId}`,
      name: `ID ${categoryId} - parent ${parentId}`,
      parentId: `${parentId}`,
    };
  });

const lv1Categories = generateCategories(0, 10);
const lv2Categories = lv1Categories
  .map(({ categoryId }) => generateCategories(categoryId, 12))
  .flat();
const lv3Categories = lv2Categories
  .map(({ categoryId }) => generateCategories(categoryId, 3))
  .flat();

const categories: Category[] = [
  ...lv1Categories,
  ...lv2Categories,
  ...lv3Categories,
];

export const getCategoriesByParentId = (parentId: string) =>
  categories.filter((category) => category.parentId === parentId);

export const getHierarchyCategories = (categories: Category[]) =>
  categories.map(
    (category) =>
      ({
        ...category,
        children: getCategoriesByParentId(category.parentId),
      } as HierarchyCategory),
  );

export const getCategoriesMap = (
  categories: Category[],
): Record<string, Category[]> =>
  categories.reduce(
    (prev, { categoryId }) => ({
      ...prev,
      [categoryId]: getCategoriesByParentId(categoryId),
    }),
    {},
  );
