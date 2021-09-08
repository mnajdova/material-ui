import * as React from 'react';
import { SxProps } from '@mui/system';
import { InternalStandardProps as StandardProps, Theme } from '..';
import { ModalProps } from '../Modal';
import { SlideProps } from '../Slide';
import { PaperProps } from '../Paper';
import { TransitionProps } from '../transitions/transition';
import { DrawerClasses } from './drawerClasses';

export interface DrawerComponentsPropsOverrides {}

export interface DrawerProps extends StandardProps<ModalProps, 'open' | 'children' | 'components' | 'componentsProps'> {
  /**
   * Side from which the drawer will appear.
   * @default 'left'
   */
  anchor?: 'left' | 'top' | 'right' | 'bottom';
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DrawerClasses>;
  /**
   * The components used for each slot inside the InputBase.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  components?: {
    Root?: React.ElementType;
    Transition?: React.ElementType;
    Paper?: React.ElementType;
  };
  /**
   * The props used for each slot inside the Input.
   * @default {}
   */
  componentsProps?: {
    root?: React.HTMLAttributes<HTMLDivElement> & DrawerComponentsPropsOverrides;
    transition?: React.InputHTMLAttributes<HTMLInputElement> & DrawerComponentsPropsOverrides;
    paper?: React.InputHTMLAttributes<HTMLInputElement> & DrawerComponentsPropsOverrides;
  };
  /**
   * The elevation of the drawer.
   * @default 16
   */
  elevation?: number;
  /**
   * Props applied to the [`Modal`](/api/modal/) element.
   * @default {}
   */
  ModalProps?: Partial<ModalProps>;
  /**
   * Callback fired when the component requests to be closed.
   *
   * @param {object} event The event source of the callback.
   */
  onClose?: ModalProps['onClose'];
  /**
   * If `true`, the component is shown.
   * @default false
   */
  open?: boolean;
  /**
   * Props applied to the [`Paper`](/api/paper/) element.
   * @default {}
   */
  PaperProps?: Partial<PaperProps>;
  /**
   * Props applied to the [`Slide`](/api/slide/) element.
   */
  SlideProps?: Partial<SlideProps>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   * @default { enter: duration.enteringScreen, exit: duration.leavingScreen }
   */
  transitionDuration?: TransitionProps['timeout'];
  /**
   * The variant to use.
   * @default 'temporary'
   */
  variant?: 'permanent' | 'persistent' | 'temporary';
}

/**
 * The props of the [Modal](https://material-ui.com/api/modal/) component are available
 * when `variant="temporary"` is set.
 *
 * Demos:
 *
 * - [Drawers](https://material-ui.com/components/drawers/)
 *
 * API:
 *
 * - [Drawer API](https://material-ui.com/api/drawer/)
 */
export default function Drawer(props: DrawerProps): JSX.Element;
