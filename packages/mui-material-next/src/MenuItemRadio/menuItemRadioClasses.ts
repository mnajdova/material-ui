import {
  unstable_generateUtilityClasses as generateUtilityClasses,
  unstable_generateUtilityClass as generateUtilityClass,
} from '@mui/utils';

export interface MenuItemRadioClasses {
  /** Styles applied to the root element. */
  root: string;
  /** State class applied to the root element if keyboard focused. */
  focusVisible: string;
  /** Styles applied to the root element if dense. */
  dense: string;
  /** State class applied to the root element if `disabled={true}`. */
  disabled: string;
  /** Styles applied to the root element if `divider={true}`. */
  divider: string;
  /** Styles applied to the inner `component` element unless `disableGutters={true}`. */
  gutters: string;
  /** State class applied to the root element if `checked={true}`. */
  checked: string;
}

export type MenuItemRadioClassKey = keyof MenuItemRadioClasses;

export function getMenuItemRadioUtilityClass(slot: string): string {
  return generateUtilityClass('MuiMenuItemRadio', slot);
}

const menuItemRadioClasses: MenuItemRadioClasses = generateUtilityClasses('MuiMenuItemRadio', [
  'root',
  'focusVisible',
  'dense',
  'disabled',
  'divider',
  'gutters',
  'checked',
]);

export default menuItemRadioClasses;
