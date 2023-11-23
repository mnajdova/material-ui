'use client';
import * as React from 'react';
import { unstable_useId as useId } from '@mui/utils';
import { ListContext, ListContextValue, ListItemState } from '../useList';

/**
 * Stabilizes the ListContext value for the MenuItemRadio component, so it doesn't change when sibling items update.
 *
 * @param id The id of the MenuItemRadio. If undefined, it will be generated with useId.
 * @returns The stable ListContext value and the id of the MenuItemRadio.
 *
 * Demos:
 *
 * - [Menu](https://mui.com/base-ui/react-menu/#hooks)
 *
 * API:
 *
 * - [useMenuItemRadioContextStabilizer API](https://mui.com/base-ui/react-menu/hooks-api/#use-menu-item-context-stabilizer)
 */
export function useMenuItemRadioContextStabilizer(id: string | undefined) {
  const listContext = React.useContext(ListContext as React.Context<ListContextValue<string>>);

  if (!listContext) {
    throw new Error('MenuItemRadio: ListContext was not found.');
  }
  const itemId = useId(id);

  const { getItemState, dispatch } = listContext;

  let itemState: ListItemState;
  if (itemId != null) {
    itemState = getItemState(itemId);
  } else {
    itemState = { focusable: true, highlighted: false, selected: false };
  }

  const { highlighted, selected, focusable } = itemState;

  // The local version of getItemState can be only called with the current Option's value.
  // It doesn't make much sense to render an Option depending on other Options' state anyway.
  const localGetItemState = React.useCallback(
    (itemValue: string) => {
      if (itemValue !== itemId) {
        throw new Error(
          [
            'Base UI MenuItemRadio: Tried to access the state of another MenuItem.',
            `itemValue: ${itemValue} | id: ${itemId}`,
            'This is unsupported when the MenuItemRadio uses the MenuItemRadioContextStabilizer as a performance optimization.',
          ].join('/n'),
        );
      }

      return {
        highlighted,
        selected,
        focusable,
      };
    },
    [highlighted, selected, focusable, itemId],
  );

  // Create a local (per MenuItemRadio) instance of the ListContext that changes only when
  // the getItemState's return value changes.
  // This makes MenuItemsRadio re-render only when their state actually change, not when any MenuItemRadio's state changes.
  const localContextValue = React.useMemo(
    () => ({
      dispatch,
      getItemState: localGetItemState,
    }),
    [dispatch, localGetItemState],
  );

  return {
    contextValue: localContextValue,
    id: itemId,
  };
}
