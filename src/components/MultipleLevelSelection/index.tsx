import React, { memo, Key } from 'react';

import { useClassNames, useSelect, UseSelectProps, ClassName } from './utils';
import './styles.css';

export function MultipleLevelSelectionComponent<TItem = string>({
  classes,
  getItemKey,
  getItemLabel,
  hasNestedItems,
  ...rest
}: MultipleLevelSelectionProps<TItem>) {
  const {
    open,
    label,
    renderingItems,
    toggle,
    handleClickItem,
    isSelectedItem,
  } = useSelect({
    ...rest,
    getItemLabel,
    hasNestedItems,
  });

  const classesNames = useClassNames(classes);

  return (
    <div className={classesNames.root()}>
      <div className={classesNames.overlay(open)} onClick={toggle} />
      <div className={classesNames.selectionHeader()} onClick={toggle}>
        <span>{label}</span>
      </div>
      {renderingItems && (
        <div className={classesNames.selectionEntries(open)}>
          <div className="flex flex-row">
            {Object.keys(renderingItems).map((level: string) => (
              <ul
                key={`entry-level-${level}`}
                className={classesNames.levelEntry()}
              >
                {renderingItems[+level].map((item) => {
                  const selected = isSelectedItem(item, +level);
                  const nestable = hasNestedItems(item, +level);
                  return (
                    <li
                      key={getItemKey(item)}
                      className={classesNames.levelItem({
                        nestable,
                        selected,
                      })}
                      title={getItemLabel(item)}
                      onClick={handleClickItem(item, +level)}
                    >
                      {getItemLabel(item)}
                    </li>
                  );
                })}
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

export interface MultipleLevelSelectionProps<TItem>
  extends UseSelectProps<TItem> {
  getItemKey: (item: TItem) => Key;
  classes?: Partial<Record<ClassName, string>>;
}
