interface Category {
  categoryId: string;
  parentId: string;
  name: string;
}

interface HierarchyCategory extends Category {
  children: Category[];
}
