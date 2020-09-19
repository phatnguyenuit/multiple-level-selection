import { useState, useMemo, useCallback } from 'react';
import clsx from 'clsx';

import useToggle from 'hooks/useToggle';

export const useSelect = <TItem = string>({
  placeholder,
  initialItems,
  getNestedItems,
  hasNestedItems,
  onChange,
  getItemLabel,
  isEqual,
}: UseSelectProps<TItem>) => {
  const [open, toggle] = useToggle();
  const [selectedItem, setSelectedItem] = useState<TItem>();

  /**
   * Render data by level
   * {
   *    1: TItem[],
   *    2: TItem[],
   *    ....so on
   * }
   */
  const [renderingItems, setRenderingItems] = useState<Record<number, TItem[]>>(
    {
      1: initialItems,
    },
  );
  const [selectedItems, setSelectedItems] = useState<Record<number, TItem>>();

  const label = useMemo(() => {
    if (!selectedItem) return placeholder;
    return getItemLabel(selectedItem);
  }, [getItemLabel, placeholder, selectedItem]);

  const handleGetNestedItems = useCallback(
    async (item: TItem, level: number) => {
      const nestedItems = await getNestedItems(item, level);

      // Update rendering items
      if (nestedItems.length) {
        setRenderingItems((prev) => ({ ...prev, [level]: nestedItems }));
      }
    },
    [getNestedItems],
  );

  const isSelectedItem = useCallback(
    (item: TItem, level: number) => {
      const selected =
        selectedItems?.[level] && isEqual(item, selectedItems[level]);
      return !!selected;
    },
    [isEqual, selectedItems],
  );

  const handleClickItem = useCallback(
    (item: TItem, level: number) => () => {
      // Remove level++ items
      setRenderingItems((prev) =>
        Object.entries(prev || {}).reduce(
          (updatedrenderingItems, [currentLevel, currentLevelItems]) => {
            if (+currentLevel > level) return updatedrenderingItems;
            return {
              ...updatedrenderingItems,
              [+currentLevel]: currentLevelItems,
            };
          },
          {},
        ),
      );

      // Select item
      setSelectedItems((prev) => ({ ...prev, [level]: item }));

      if (hasNestedItems(item, level)) {
        // Fetch level + 1 items
        handleGetNestedItems(item, level + 1);
      } else {
        // Select item and close dropdown
        setSelectedItem(item);
        onChange?.(item);
        toggle();
      }
    },
    [handleGetNestedItems, hasNestedItems, onChange, toggle],
  );

  return {
    open,
    label,
    renderingItems,
    selectedItems,
    toggle,
    handleClickItem,
    isSelectedItem,
  };
};

export const useClassNames = (
  classes?: Partial<Record<ClassName, string>>,
) => ({
  root: () => clsx('selection-root', classes?.root),
  overlay: (open: boolean) =>
    clsx('overlay', classes?.overlay, { hidden: !open }),
  selectionHeader: () =>
    clsx('select-wrapper', 'selection-header', classes?.selectionHeader),
  selectionEntries: (open: boolean) =>
    clsx('selection-entries', classes?.selectionEntries, {
      hidden: !open,
    }),
  levelEntry: () => clsx('entry-level', classes?.levelEntry),
  levelItem: ({
    nestable,
    selected,
  }: {
    nestable: boolean;
    selected: boolean;
  }) =>
    clsx('entry-item', classes?.levelItem, {
      'entry-item__nestable': nestable,
      'entry-item__selected': selected,
      [classes?.levelSelectedItem ?? '']: selected,
    }),
});

const classNames = [
  'root',
  'overlay',
  'selectionHeader',
  'selectionEntries',
  'levelEntry',
  'levelItem',
  'levelSelectedItem',
] as const;

export type ClassName = typeof classNames[number];
export interface UseSelectProps<TItem> {
  initialItems: TItem[];
  placeholder: string;
  getItemLabel: (item: TItem) => string;
  getNestedItems: (item: TItem, level: number) => Promise<TItem[]> | TItem[];
  hasNestedItems: (item: TItem, level: number) => boolean;
  isEqual: (item?: TItem, item2?: TItem) => boolean;
  onChange?: (item: TItem) => void;
}
