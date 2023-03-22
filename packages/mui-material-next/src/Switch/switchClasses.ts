import generateUtilityClass from '@mui/material/generateUtilityClass';
import generateUtilityClasses from '@mui/material/generateUtilityClasses';

export interface SwitchClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the thumb element. */
  thumb: string;
  /** Styles applied to the track element. */
  track: string;
  /** Styles applied to the input element. */
  input: string;
  /** Styles applied to the touchRipple element. */
  touchRipple: string;      
  /** State class applied to the ButtonBase root element if the button is keyboard focused. */
  focusVisible: string;
  /** State class applied to the root element if `disabled={true}`. */
  disabled: string;
  /** State class applied to the root element if `checked={true}`. */
  checked: string;  
  /** State class applied to the root element if `variant={outlined}`. */
  outlined: string;
  /** State class applied to the root element if `variant={filled}`. */
  filled: string;      
  /** Styles applied to the root element if `color="primary"`. */
  colorPrimary: string;
  /** Styles applied to the root element if `color="secondary"`. */
  colorSecondary: string;
  /** Styles applied to the root element if `color="tertiary"`. */
  colorTertiary: string;
}

export type SwitchClassKey = keyof SwitchClasses;

export function getSwitchUtilityClass(slot: string): string {
  return generateUtilityClass('MuiSwitch', slot);
}

const switchClasses: SwitchClasses = generateUtilityClasses('MuiSwitch', [
  'root',
  'thumb',
  'track',
  'input',
  'outlined',
  'filled',
  'touchRipple',
  'edgeStart',
  'edgeEnd',
  'colorPrimary',
  'colorSecondary',
  'colorTertiary',
  'checked',
  'disabled',
  'focusVisible'
]);

export default switchClasses;
