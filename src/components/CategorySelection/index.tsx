import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import useToggle from 'hooks/useToggle';

import { getCategoriesByParentId } from './seeds';
import './styles.css';

const categoryMap: Record<string, string> = {};
export const CategorySelectionComponent: React.FC = () => {
  const [open, toggle] = useToggle();
  const [value, setValue] = useState<string>();

  const [renderData, setRenderData] = useState<Record<number, Category[]>>();
  const [selectedData, setSelectedData] = useState<Record<number, string>>();

  const handleClickCategory = (categoryId: string, level: number) => () => {
    // Update level++ data to []
    setRenderData((prev) =>
      Object.entries(prev || {}).reduce(
        (updatedRenderData, [currentLevel, currentLevelCategories]) => {
          if (+currentLevel > level) return updatedRenderData;
          return {
            ...updatedRenderData,
            [+currentLevel]: currentLevelCategories,
          };
        },
        {},
      ),
    );

    // Select item
    setSelectedData((prev) => ({ ...prev, [level]: `${categoryId}` }));

    // Fetch level + 1 data
    fetchCategoryByParentId(categoryId, level + 1);
  };

  const fetchCategoryByParentId = useCallback(
    (categoryId: string | number, level: number) => {
      const fetchedCategories = getCategoriesByParentId(`${categoryId}`);

      // Store to categoryMap
      fetchedCategories.forEach(
        ({ categoryId, name }) => (categoryMap[categoryId] = name),
      );

      // Update render data
      if (fetchedCategories.length) {
        setRenderData((prev) => ({ ...prev, [level]: fetchedCategories }));
      } else {
        setValue(`${categoryId}`);
      }
    },
    [],
  );

  useEffect(() => {
    if (!renderData) {
      fetchCategoryByParentId(0, 1);
    }
  }, [renderData, fetchCategoryByParentId]);

  const label = useMemo(() => {
    if (!value) return 'Placeholder';
    return categoryMap[value];
  }, [value]);

  return (
    <div className="category-selection-root">
      <div className={clsx('overlay', { hidden: !open })} onClick={toggle} />
      <div
        className="select-wrapper category-selection-header"
        onClick={toggle}
      >
        {label}
      </div>
      {renderData && (
        <div className={clsx('category-selection-entries', { hidden: !open })}>
          <div className="flex flex-row">
            {Object.keys(renderData).map((level: string) => (
              <ul
                key={`category-entry-level-${level}`}
                className="category-entry-level"
              >
                {renderData[+level].map(({ categoryId, name }) => (
                  <li
                    key={categoryId}
                    className={clsx('category-entry-level-item', {
                      'category-entry-level-item-selected':
                        selectedData?.[+level] === categoryId,
                    })}
                    title={name}
                    onClick={handleClickCategory(categoryId, +level)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CategorySelection = memo(CategorySelectionComponent);
CategorySelection.displayName = 'CategorySelection';

export default CategorySelection;
