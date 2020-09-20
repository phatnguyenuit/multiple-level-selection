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

const lv1Categories = generateCategories(0, 20);

const lv2Categories = lv1Categories
  .map(({ categoryId }) => generateCategories(categoryId, 10))
  .flat();

const lv3Categories = lv2Categories
  .map(({ categoryId }) => generateCategories(categoryId, 4))
  .flat();

const categories: Category[] = [
  ...lv1Categories,
  ...lv2Categories,
  ...lv3Categories,
];

export const getCategoriesByParentId = (parentId: string | number) =>
  categories.filter((category) => category.parentId === `${parentId}`);
