interface Category {
  categoryId: string;
  parentId: string;
  name: string;
}

type CatgoryListData = ListData<Category>;

interface HierarchyCategory extends Category {
  children: Category[];
}
