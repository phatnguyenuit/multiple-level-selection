import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import useToggle from 'hooks/useToggle';

import { getCategoriesByParentId } from './seeds';
import './styles.css';

const categoryMap: Record<string, string> = {};
export const MultipleLevelSelectionComponent: React.FC = () => {
  const [open, toggle] = useToggle();
  const [value, setValue] = useState<string>();

  const [renderData, setRenderData] = useState<Record<number, Category[]>>();
  const [selectedData, setSelectedData] = useState<Record<number, string>>();

  const handleClickItem = (item: string, level: number) => () => {
    // Remove level++ data
    setRenderData((prev) =>
      Object.entries(prev || {}).reduce(
        (updatedRenderData, [currentLevel, currentLevelItems]) => {
          if (+currentLevel > level) return updatedRenderData;
          return {
            ...updatedRenderData,
            [+currentLevel]: currentLevelItems,
          };
        },
        {},
      ),
    );

    // Select item
    setSelectedData((prev) => ({ ...prev, [level]: `${item}` }));

    // Fetch level + 1 data
    fetchLevelItems(item, level + 1);
  };

  const fetchLevelItems = useCallback(
    (item: string | number, level: number) => {
      const fetchedCategories = getCategoriesByParentId(`${item}`);

      // Store to categoryMap
      fetchedCategories.forEach(
        ({ categoryId, name }) => (categoryMap[categoryId] = name),
      );

      // Update render data
      if (fetchedCategories.length) {
        setRenderData((prev) => ({ ...prev, [level]: fetchedCategories }));
      } else {
        setValue(`${item}`);
      }
    },
    [],
  );

  useEffect(() => {
    if (!renderData) {
      fetchLevelItems(0, 1);
    }
  }, [renderData, fetchLevelItems]);

  const label = useMemo(() => {
    if (!value) return 'Placeholder';
    return categoryMap[value];
  }, [value]);

  return (
    <div className="multiple-level-selection-root">
      <div className={clsx('overlay', { hidden: !open })} onClick={toggle} />
      <div
        className="select-wrapper multiple-level-selection-header"
        onClick={toggle}
      >
        {label}
      </div>
      {renderData && (
        <div
          className={clsx('multiple-level-selection-entries', {
            hidden: !open,
          })}
        >
          <div className="flex flex-row">
            {Object.keys(renderData).map((level: string) => (
              <ul
                key={`multiple-level-entry-level-${level}`}
                className="multiple-level-entry-level"
              >
                {renderData[+level].map(({ categoryId, name }) => (
                  <li
                    key={categoryId}
                    className={clsx('multiple-level-entry-level-item', {
                      'multiple-level-entry-level-item-selected':
                        selectedData?.[+level] === categoryId,
                    })}
                    title={name}
                    onClick={handleClickItem(categoryId, +level)}
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

const MultipleLevelSelection = memo(MultipleLevelSelectionComponent);
MultipleLevelSelection.displayName = 'MultipleLevelSelection';

export default MultipleLevelSelection;
