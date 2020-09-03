import React, { memo, useCallback, useMemo, useState, Key } from 'react';
import clsx from 'clsx';

import useToggle from 'hooks/useToggle';

import './styles.css';

export function MultipleLevelSelectionComponent<TItem = string>({
  initialItems,
  placeholder,
  classes,
  getItemKey,
  getItemLabel,
  isEqual,
  onChange,
  getNestedItems,
  hasNestedItems,
}: MultipleLevelSelectionProps<TItem>) {
  const [open, toggle] = useToggle();
  const [selectedItem, setSelectedItem] = useState<TItem>();

  // Render data by level
  /**
   * {
   *    1: item[],
   *    2: item[],
   *    ....so on
   * }
   */
  const [renderData, setRenderData] = useState<Record<number, TItem[]>>({
    1: initialItems,
  });
  const [selectedData, setSelectedData] = useState<Record<number, TItem>>();

  const fetchNestedItems = useCallback(
    async (item: TItem, level: number) => {
      const fetchedCategories = await getNestedItems(item, level);

      // Update render data
      if (fetchedCategories.length) {
        setRenderData((prev) => ({ ...prev, [level]: fetchedCategories }));
      } else {
        // Select item and close dropdown
        setSelectedItem(item);
        onChange?.(item);
        toggle();
      }
    },
    [getNestedItems, onChange, toggle],
  );

  const label = useMemo(() => {
    if (!selectedItem) return placeholder;
    return getItemLabel(selectedItem);
  }, [getItemLabel, placeholder, selectedItem]);

  const handleClickItem = (item: TItem, level: number) => () => {
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
    setSelectedData((prev) => ({ ...prev, [level]: item }));

    // Fetch level + 1 data
    fetchNestedItems(item, level + 1);
  };

  return (
    <div className={clsx('selection-root', classes?.root)}>
      <div
        className={clsx('overlay', classes?.overlay, { hidden: !open })}
        onClick={toggle}
      />
      <div
        className={clsx(
          'select-wrapper',
          'selection-header',
          classes?.selectionHeader,
        )}
        onClick={toggle}
      >
        {label}
      </div>
      {renderData && (
        <div
          className={clsx('selection-entries', classes?.selectionEntries, {
            hidden: !open,
          })}
        >
          <div className="flex flex-row">
            {Object.keys(renderData).map((level: string) => (
              <ul
                key={`entry-level-${level}`}
                className={clsx('entry-level', classes?.levelEntry)}
              >
                {renderData[+level].map((item) => (
                  <li
                    key={getItemKey(item)}
                    className={clsx('entry-item', classes?.levelItem, {
                      'entry-item__nestable': hasNestedItems(item, +level),
                      'entry-item__selected':
                        selectedData?.[+level] &&
                        isEqual(item, selectedData[+level]),
                      [classes?.levelSelectedItem ?? '']:
                        selectedData?.[+level] &&
                        isEqual(item, selectedData[+level]),
                    })}
                    title={getItemLabel(item)}
                    onClick={handleClickItem(item, +level)}
                  >
                    {getItemLabel(item)}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const MultipleLevelSelection = memo(
  MultipleLevelSelectionComponent,
) as typeof MultipleLevelSelectionComponent & React.ComponentType<any>;
MultipleLevelSelection.displayName = 'MultipleLevelSelection';

export default MultipleLevelSelection;

const classNames = [
  'root',
  'overlay',
  'selectionHeader',
  'selectionEntries',
  'levelEntry',
  'levelItem',
  'levelSelectedItem',
] as const;

interface MultipleLevelSelectionProps<TItem> {
  initialItems: TItem[];
  placeholder: string;
  getItemKey: (item: TItem) => Key;
  getItemLabel: (item: TItem) => string;
  getNestedItems: (item: TItem, level: number) => Promise<TItem[]> | TItem[];
  hasNestedItems: (item: TItem, level: number) => boolean;
  isEqual: (item: TItem, item2: TItem) => boolean;
  classes?: Partial<Record<typeof classNames[number], string>>;
  onChange?: (item: TItem) => void;
}
